import { run } from "@subsquid/batch-processor";
import { augmentBlock, Block } from "@subsquid/fuel-objects";
import { DataHandlerContext, DataSourceBuilder } from "@subsquid/fuel-stream";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { OrderbookAbi } from "./OrderbookAbi";
//import { Contract } from "./model";
import { assertNotNull } from "@subsquid/util-internal";
import { _abi } from "./OrderbookAbi__factory";
import { transcode } from "buffer";
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
  SpotOrder,
  SpotOrderChangeEvent,
  SpotOrderType,
  SpotMarketCreateEvent,
  SpotTradeEvent,
} from "./model";
import isEvent from "./utils/isEvent";
import tai64ToDate from "./utils/tai64ToDate";
import { MarketCreateEvent, OrderChangeEvent } from "./event";
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
  let cancelEvents: Map<string, SpotOrderChangeEvent> = new Map();
  let blocks = ctx.blocks.map(augmentBlock);
  let orderMatchEvents: Map<string, SpotOrderChangeEvent> = new Map();
  let orders: Map<string, SpotOrder> = new Map();
  let orderOpenEvents: Map<string, SpotOrderChangeEvent> = new Map();
  let marketCreateEvents: Map<string, SpotMarketCreateEvent> = new Map();
  let spotTradeEvents: Map<string, SpotTradeEvent> = new Map();
  const receipts: (ReceiptLogData & { data: string })[] = [];
  for (let block of blocks) {
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
  }
  let logs:any[] = getDecodedLogs(receipts, abi);

  // let createEvents: SpotMarketCreateEvent[] = [];
  for (let log of logs){
    if (isEvent("OrderChangeEvent", log, abi)) {
      const eventOrder = log.order;
      const timestamp = tai64ToDate(log.timestamp);
      const order: SpotOrder | null = eventOrder
        ? new SpotOrder({
            id: eventOrder.id,
            trader: eventOrder.trader.bits,
            baseToken: eventOrder.base_token.bits,
            baseSize: decodeI64(eventOrder.base_size),
            orderType:
              eventOrder.base_size.value === 0n
                ? null
                : eventOrder.base_size.negative
                ? SpotOrderType.sell
                : SpotOrderType.buy,
            basePrice: BigInt(eventOrder.base_price),
            timestamp: tai64ToDate(log.timestamp).toString(),
          })
        : null;
      let newBaseSize = order ? order.baseSize : "0";
      const idSource = `${log.tx_id}-${timestamp}-${
        log.order_id
      }-${newBaseSize}-${Math.random()}`;
      const id = crypto.createHash("sha256").update(idSource).digest("hex");
      if (
        log.order_id ==
        "0x0bfdce96c5d4ab88109bcfbd4c546798d7e100badc58753185872ee8ad3f7ba2"
      ) {
        console.log("Order ID is 0x-");
        console.log(log);
        console.log("SIZE");
        //console.log(BigInt(eventOrder.base_size.value));
      }
      if (order) {
        orders.set(order.id, order);
      }
      let maybeExistingOrder = orders.get(log.order_id);
      if (!maybeExistingOrder) {
        maybeExistingOrder = await ctx.store.findOne(SpotOrder, {
          where: { id: log.order_id },
        });
      }

      if (maybeExistingOrder) {
        let ammendedOrder = new SpotOrder({
          id: maybeExistingOrder.id,
          trader: maybeExistingOrder.trader,
          baseToken: maybeExistingOrder.baseToken,
          baseSize: newBaseSize,
          basePrice: maybeExistingOrder.basePrice,
          timestamp: maybeExistingOrder.timestamp,
          orderType:
            eventOrder == null ||
            BigInt(eventOrder.base_size.value) === BigInt(0) ||
            eventOrder == undefined
              ? null
              : eventOrder.base_size.negative
              ? SpotOrderType.sell
              : SpotOrderType.buy,
        });
        orders.set(ammendedOrder.id, ammendedOrder);

      }
      let evOrder = orders.get(log.order_id);
      const newSpotOrderChangeEvent: SpotOrderChangeEvent =
        new SpotOrderChangeEvent({
          id: id,
          order: evOrder, //order ? order : maybeExistingOrder,
          newBaseSize: order ? order.baseSize : "0",
          timestamp: tai64ToDate(log.timestamp).toString(),
          identifier: log.identifier,
          txId: log.tx_id,
        });

      orderMatchEvents.set(newSpotOrderChangeEvent.id, newSpotOrderChangeEvent);
    }
    if (isEvent("MarketCreateEvent", log, abi)) {
      console.log("Market Create Event", log);
      const idSource = `${log.asset_decimals}-${
        log.asset_id.bits
      }-${tai64ToDate(log.timestamp)}-${log.tx_id}`;
      const id = crypto.createHash("sha256").update(idSource).digest("hex");
      let event = new SpotMarketCreateEvent({
        id: id,
        assetDecimals: log.asset_decimals,
        assetId: log.asset_id.bits,
        timestamp: tai64ToDate(log.timestamp).toString(),
        txId: log.tx_id,
      });
      marketCreateEvents.set(event.id, event);
    }
    if (isEvent("TradeEvent", log, abi)) {
      const idSource = `${log.base_token.bits}-${log.order_matcher.bits}-${
        log.seller.bits
      }-${log.buyer.bits}-${log.trade_size}-${log.trade_price}-${
        log.sell_order_id
      }-${log.buy_order_id}-${tai64ToDate(log.timestamp)}-${log.tx_id}`;
      const id = crypto.createHash("sha256").update(idSource).digest("hex");
      //console.log("Trade Event", log);

      let sellOrder = orders.get(log.sell_order_id);
      if (!sellOrder) {
        sellOrder = await lookUpOrder(ctx.store, orders, log.sell_order_id);
      }

      let buyOrder = orders.get(log.buy_order_id);
      if (!buyOrder) {
        buyOrder = await lookUpOrder(ctx.store, orders, log.buy_order_id);
      }
      let event = new SpotTradeEvent({
        id: id,
        baseToken: log.base_token.bits,
        orderMatcher: log.order_matcher.bits,
        seller: log.seller.bits,
        buyer: log.buyer.bits,
        tradeSize: BigInt(log.trade_size),
        tradePrice: BigInt(log.trade_price),
        sellOrder: sellOrder,
        buyOrder: buyOrder,
        timestamp: tai64ToDate(log.timestamp).toString(),
        txId: log.tx_id,
      });
      spotTradeEvents.set(event.id, event);
    }
  };

  await ctx.store.upsert([...orders.values()]);

  await ctx.store.save([...orderMatchEvents.values()]);
  await ctx.store.save([...marketCreateEvents.values()]);
  await ctx.store.save([...spotTradeEvents.values()]);
});

function processOrder(log: any) {
  let order = log.order;
  if (!order) {
    return new SpotOrder({
      id: log.order_id,
      orderType: null,
      trader: "0x-",
      baseToken: "0x-",
      baseSize: "0",
      basePrice: BigInt(0),
      timestamp: tai64ToDate(log.timestamp).toString(),
    });
  }
  return new SpotOrder({
    id: log.order_id,
    trader: order.trader.bits,
    baseToken: order.base_token.bits,
    baseSize: decodeI64(order.base_size),
    basePrice: BigInt(order.base_price),
    timestamp: tai64ToDate(log.timestamp).toString(),
    orderType:
      order.base_size.value === 0n
        ? null
        : order.base_size.negative
        ? SpotOrderType.sell
        : SpotOrderType.buy,
  });
}

function processOrderOpenEvent(log: any, order: SpotOrder) {
  //("Order Open Event", log);
  const timestamp = tai64ToDate(log.timestamp);
  const idSource = `${log.tx_id}-${timestamp}-${log.order_id}`;
  const id = crypto.createHash("sha256").update(idSource).digest("hex");
  let event = new SpotOrderChangeEvent({
    id: id,
    newBaseSize: order.baseSize,
    identifier: "OrderOpenEvent",
    timestamp: tai64ToDate(log.timestamp).toString(),
    order: order,
    txId: log.tx_id,
  });
  return event;
}

function createCancelledOrder(log: any) {
  return new SpotOrder({
    id: log.order_id,
    orderType: null,
    trader: "0x-",
    baseToken: "0x-",
    baseSize: "0",
    basePrice: BigInt(0),
    timestamp: tai64ToDate(log.timestamp).toString(),
  });
}

function processOrderCancelEvent(log: any, order: SpotOrder) {
  const timestamp = tai64ToDate(log.timestamp);
  const idSource = `${log.tx_id}-${timestamp}-${log.order_id}`;
  const id = crypto.createHash("sha256").update(idSource).digest("hex");
  let event = new SpotOrderChangeEvent({
    id: id,
    newBaseSize: order.baseSize,
    identifier: "OrderCancelEvent",
    timestamp: tai64ToDate(log.timestamp).toString(),
    order: order,
    txId: log.tx_id,
  });
  return event;
}

function processOrderMatchEvent(log: any, order: SpotOrder) {
  //console.log("Order Match Event", log);
  const timestamp = tai64ToDate(log.timestamp);
  const idSource = `${log.tx_id}-${timestamp}-${log.order_id}`;
  const id = crypto.createHash("sha256").update(idSource).digest("hex");
  let event = new SpotOrderChangeEvent({
    id: id,
    newBaseSize: order.baseSize,
    identifier: "OrderCancelEvent",
    timestamp: tai64ToDate(log.timestamp).toString(),
    order: order,
    txId: log.tx_id,
  });
  return event;
}

function decodeI64(i64: {
  readonly value: bigint;
  readonly negative: boolean;
}) {
  return (i64.negative ? "-" : "") + i64.value.toString();
}

async function lookUpOrder(
  store: Store,
  orders: Map<string, SpotOrder>,
  id: string
) {
  let order = orders.get(id);
  if (!order) {
    order = await store.get(SpotOrder, id);
  }
  return order;
}
