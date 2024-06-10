import {
  Contract,
  getDecodedLogs,
  JsonAbi,
  TransactionResultReceipt,
} from "fuels";
import crypto from "crypto";

import isEvent from "./utils/isEvent";
import BN from "./utils/BN";
import tai64ToDate from "./utils/tai64ToDate";
import {
  SpotOrder,
  SpotMarketCreateEvent,
  SpotOrderChangeEvent,
  SpotTradeEvent,
} from "./model/generated";
import { DataHandlerContext } from "@subsquid/fuel-stream";
import { Block } from "@subsquid/fuel-objects";
import { Store } from "@subsquid/typeorm-store";
export async function decodeOrderbookReceipts(
  receipts: TransactionResultReceipt[],
  abi: JsonAbi,
  store: Store
) {
  let orders: Map<string, SpotOrder> = new Map();
  let createEvents: SpotMarketCreateEvent[] = [];
  let orderChangeEvents: SpotOrderChangeEvent[] = [];
  let tradeEvents: SpotTradeEvent[] = [];
  const logs = getDecodedLogs(receipts, abi);
  const decodedLogs = logs.map(async (log: any) => {
    // MarketCreateEvent
    if (isEvent("MarketCreateEvent", log, abi)) {
      console.log("MarketCreateEvent");
      console.log(log);
      const idSource = `${log.asset_decimals}-${
        log.asset_id.bits
      }-${tai64ToDate(log.timestamp)}-${log.tx_id}`;
      const id = crypto.createHash("sha256").update(idSource).digest("hex");
      let event = new SpotMarketCreateEvent({
        id: id,
        assetId: log.assetId,
        assetDecimals: log.assetDecimals,
        timestamp: log.timestamp,
        txId: log.txId,
      });
      //console.log(event);
      await store.upsert(event);
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
      if (log.order) {
        let order = log.order;
        let spotOrder = new SpotOrder({
          id: order.id,
          trader: order.trader.bits,
          baseToken: order.base_token.bits,
          baseSize: order.base_size.value,
          basePrice: order.base_price,
          timestamp: tai64ToDate(log.timestamp).toString(),
        });
        orders.set(order.id, spotOrder);
        await store.upsert(spotOrder);
        //console.log(spotOrder);
      }
      //console.log(event);
      await store.upsert(event);
      orderChangeEvents.push(event);
    }
    // TradeEvent
    if (isEvent("TradeEvent", log, abi)) {
      console.log("TradeEvent");
      console.log(log);
      const idSource = `${log.base_token.bits}-${log.order_matcher.bits}-${
        log.seller.bits
      }-${log.buyer.bits}-${log.trade_size}-${log.trade_price}-${
        log.sell_order_id
      }-${log.buy_order_id}-${tai64ToDate(log.timestamp)}-${log.tx_id}`;
      const id = crypto.createHash("sha256").update(idSource).digest("hex");

      let event = new SpotTradeEvent({
        id: id,
        timestamp: tai64ToDate(log.timestamp).toString(),
        txId: log.txId,
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
      await store.upsert(event);
    }
  });

  // await store.upsert([...orders.values()]);
  // await store.upsert(createEvents);
  // await store.upsert(orderChangeEvents);
  // await store.upsert(tradeEvents);
}
