"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeOrderbookReceipts = void 0;
const fuels_1 = require("fuels");
const crypto_1 = __importDefault(require("crypto"));
const isEvent_1 = __importDefault(require("./utils/isEvent"));
const tai64ToDate_1 = __importDefault(require("./utils/tai64ToDate"));
const generated_1 = require("./model/generated");
async function decodeOrderbookReceipts(receipts, abi, store) {
    let orders = new Map();
    let createEvents = [];
    let orderChangeEvents = [];
    let tradeEvents = [];
    const logs = (0, fuels_1.getDecodedLogs)(receipts, abi);
    const decodedLogs = logs.map(async (log) => {
        // MarketCreateEvent
        if ((0, isEvent_1.default)("MarketCreateEvent", log, abi)) {
            console.log("MarketCreateEvent");
            console.log(log);
            const idSource = `${log.asset_decimals}-${log.asset_id.bits}-${(0, tai64ToDate_1.default)(log.timestamp)}-${log.tx_id}`;
            const id = crypto_1.default.createHash("sha256").update(idSource).digest("hex");
            let event = new generated_1.SpotMarketCreateEvent({
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
        if ((0, isEvent_1.default)("OrderChangeEvent", log, abi)) {
            console.log("OrderChangeEvent");
            console.log(log);
            const timestamp = (0, tai64ToDate_1.default)(log.timestamp);
            const idSource = `${log.tx_id}-${timestamp}-${log.order_id}`;
            const id = crypto_1.default.createHash("sha256").update(idSource).digest("hex");
            let event = new generated_1.SpotOrderChangeEvent({
                id: id,
                timestamp: (0, tai64ToDate_1.default)(log.timestamp).toString(),
                txId: log.tx_id,
                orderId: log.order_id,
                newBaseSize: log.new_base_size,
                identifier: log.identifier,
            });
            if (log.order) {
                let order = log.order;
                let spotOrder = new generated_1.SpotOrder({
                    id: order.id,
                    trader: order.trader.bits,
                    baseToken: order.base_token.bits,
                    baseSize: order.base_size.value,
                    basePrice: order.base_price,
                    timestamp: (0, tai64ToDate_1.default)(log.timestamp).toString(),
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
        if ((0, isEvent_1.default)("TradeEvent", log, abi)) {
            console.log("TradeEvent");
            console.log(log);
            const idSource = `${log.base_token.bits}-${log.order_matcher.bits}-${log.seller.bits}-${log.buyer.bits}-${log.trade_size}-${log.trade_price}-${log.sell_order_id}-${log.buy_order_id}-${(0, tai64ToDate_1.default)(log.timestamp)}-${log.tx_id}`;
            const id = crypto_1.default.createHash("sha256").update(idSource).digest("hex");
            let event = new generated_1.SpotTradeEvent({
                id: id,
                timestamp: (0, tai64ToDate_1.default)(log.timestamp).toString(),
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
exports.decodeOrderbookReceipts = decodeOrderbookReceipts;
//# sourceMappingURL=decodeOrderbookReceipts.js.map