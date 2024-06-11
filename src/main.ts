import { run } from "@subsquid/batch-processor";
import { augmentBlock, Block } from "@subsquid/fuel-objects";
import { DataHandlerContext, DataSourceBuilder } from "@subsquid/fuel-stream";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { OrderbookAbi } from "./OrderbookAbi";
//import { Contract } from "./model";
import { assertNotNull } from "@subsquid/util-internal";
import { _abi } from "./OrderbookAbi__factory";
import { transcode } from "buffer";
import { decodeOrderbookReceipts } from "./decodeOrderbookReceipts";
import crypto from "crypto";

import {
  BN,
  Contract,
  getDecodedLogs,
  JsonAbi,
  Provider,
  ReceiptLogData,
  ReceiptType,
  TransactionResultReceipt,
} from "fuels";
import { OrderbookAbi__factory } from "./OrderbookAbi__factory";
import { decode } from "punycode";
import {
  SpotMarketCreateEvent,
  SpotOrder,
  SpotOrderChangeEvent,
  SpotOrderType,
  SpotTradeEvent,
} from "./model";
import isEvent from "./utils/isEvent";
import tai64ToDate from "./utils/tai64ToDate";
const ORDERBOOK_ID =
  "0x4a2ce054e3e94155f7092f7365b212f7f45105b74819c623744ebcc5d065c6ac";

let abi = _abi as JsonAbi;
// First we create a DataSource - component,
// that defines where to get the data and what data should we get.
const dataSource = new DataSourceBuilder()
  // Provide Subsquid Network Gateway URL.
  .setGateway("https://v2.archive.subsquid.io/network/fuel-testnet")
  // Subsquid Network is always about 10000 blocks behind the head.
  // We must use regular GraphQL endpoint to get through the last mile
  // and stay on top of the chain.
  // This is a limitation, and we promise to lift it in the future!
  .setGraphql({
    url: "https://testnet.fuel.network/v1/graphql",
    strideConcurrency: 3,
    strideSize: 50,
  })

  .setFields({
    receipt: {
      contract: true,
      receiptType: true,
      data: true,
      is: true,
      len: true,
      pc: true,
      ptr: true,
      ra: true,
      rb: true,
      digest: true,
    },
  })
  .setBlockRange({
    from: 0,
  })

  .addReceipt({
    type: ["LOG_DATA"],
    transaction: true,
    contract: [
      "0x4a2ce054e3e94155f7092f7365b212f7f45105b74819c623744ebcc5d065c6ac",
    ],
  })

  .build();

const database = new TypeormDatabase();

// Now we are ready to start data processing
run(dataSource, database, async (ctx) => {
  // Block items that we get from `ctx.blocks` are flat JS objects.
  //
  // We can use `augmentBlock()` function from `@subsquid/fuel-objects`
  // to enrich block items with references to related objects.
  let contracts: Map<String, Contract> = new Map();

  let blocks = ctx.blocks.map(augmentBlock);

  for (let block of blocks) {
    const receipts: (ReceiptLogData & { data: string })[] = [];

    for (let receipt of block.receipts) {
      if (
        receipt.contract == ORDERBOOK_ID &&
        receipt.transaction?.status.type != "FailureStatus"
      ) {
        receipts.push({
          type: ReceiptType.LogData,
          digest: assertNotNull(receipt.digest),
          id: receipt.contract,
          is: new BN(receipt.is?.toString()),
          len: new BN(receipt.len?.toString()),
          pc: new BN(receipt.pc?.toString()),
          ptr: new BN(receipt.ptr?.toString()),
          val0: new BN(receipt.ra?.toString()),
          val1: new BN(receipt.rb?.toString()),
          data: assertNotNull(receipt.data),
        });
      }
    }
    let logs = getDecodedLogs(receipts, abi);

    let orders: Map<string, SpotOrder> = new Map();
    let createEvents: SpotMarketCreateEvent[] = [];
    let orderChangeEvents: SpotOrderChangeEvent[] = [];
    let tradeEvents: SpotTradeEvent[] = [];
    try {
      logs.map(async (log: any) => {
        // MarketCreateEvent
        if (isEvent("MarketCreateEvent", log, abi)) {
          const idSource = `${log.asset_decimals}-${
            log.asset_id.bits
          }-${tai64ToDate(log.timestamp)}-${log.tx_id}`;
          const id = crypto.createHash("sha256").update(idSource).digest("hex");
          let event = new SpotMarketCreateEvent({
            id: id,
            assetId: log.asset_id.bits,
            assetDecimals: log.asset_decimals,
            timestamp: log.timestamp,
            txId: log.tx_id,
          });
          //console.log(event);
          await ctx.store.upsert(event);
          createEvents.push(event);
        }
        // OrderChangeEvent
        if (isEvent("OrderChangeEvent", log, abi)) {
          console.log("OrderChangeEvent");
          console.log(log);
          const timestamp = tai64ToDate(log.timestamp);
          const idSource = `${log.tx_id}-${timestamp}-${log.order_id}`;
          const id = crypto.createHash("sha256").update(idSource).digest("hex");
          let event = new SpotOrderChangeEvent({
            id: id,
            timestamp: tai64ToDate(log.timestamp).toString(),
            txId: log.tx_id,
            orderId: log.order_id,
            newBaseSize: log.new_base_size,
            identifier: log.identifier,
          });

          let spotOrder = undefined;
          if (log.order) {
            let existingOrder = await ctx.store.get(SpotOrder, log.order.id);
            if (existingOrder) {
              spotOrder = existingOrder;
              spotOrder.baseSize = log.order.base_size.value.toString();
              orders.set(log.order.id, spotOrder);
            } else {
              let order = log.order;

              spotOrder = new SpotOrder({
                id: order.id,
                trader: order.trader.bits,
                baseToken: order.base_token.bits,
                baseSize: order.base_size.value.toString(),
                basePrice: order.base_price.toString(),
                timestamp: tai64ToDate(log.timestamp).toString(),
                orderType:
                  order.base_size === 0n
                    ? undefined
                    : order.base_size.negative
                    ? SpotOrderType.sell
                    : SpotOrderType.buy,
              });
              //console.log("spotOrder");
              // console.log(spotOrder);
              orders.set(order.id, spotOrder);
            }
          }

          //await ctx.store.upsert(spotOrder);
          //console.log(spotOrder);

          //console.log(event);

          //await ctx.store.upsert(event);
          orderChangeEvents.push(event);
        }
        // TradeEvent
        if (isEvent("TradeEvent", log, abi)) {
          const idSource = `${log.base_token.bits}-${log.order_matcher.bits}-${
            log.seller.bits
          }-${log.buyer.bits}-${log.trade_size}-${log.trade_price}-${
            log.sell_order_id
          }-${log.buy_order_id}-${tai64ToDate(log.timestamp)}-${log.tx_id}`;
          const id = crypto.createHash("sha256").update(idSource).digest("hex");

          let event = new SpotTradeEvent({
            id: id,
            timestamp: tai64ToDate(log.timestamp).toString(),
            txId: log.tx_id,
            baseToken: log.base_token.bits,
            orderMatcher: log.order_matcher.bits,
            seller: log.seller.bits,
            buyer: log.buyer.bits,
            tradeSize: log.trade_size,
            tradePrice: log.trade_price,
            sellOrder: log.sell_order_id,
            buyOrder: log.buy_order_id,
          });
          // console.log(event);
          tradeEvents.push(event);
          //await ctx.store.upsert(event);
        }
      });
    } catch (e) {
      console.error(e);
    }

    await ctx.store.upsert([...orders.values()]);
    await ctx.store.upsert(createEvents);
    await ctx.store.upsert(orderChangeEvents);
    await ctx.store.upsert(tradeEvents);
  }
});
