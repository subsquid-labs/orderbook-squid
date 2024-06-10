"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const batch_processor_1 = require("@subsquid/batch-processor");
const fuel_objects_1 = require("@subsquid/fuel-objects");
const fuel_stream_1 = require("@subsquid/fuel-stream");
const typeorm_store_1 = require("@subsquid/typeorm-store");
//import { Contract } from "./model";
const util_internal_1 = require("@subsquid/util-internal");
const OrderbookAbi__factory_1 = require("./OrderbookAbi__factory");
const crypto_1 = __importDefault(require("crypto"));
const fuels_1 = require("fuels");
const model_1 = require("./model");
const isEvent_1 = __importDefault(require("./utils/isEvent"));
const tai64ToDate_1 = __importDefault(require("./utils/tai64ToDate"));
const ORDERBOOK_ID = "0x4a2ce054e3e94155f7092f7365b212f7f45105b74819c623744ebcc5d065c6ac";
let abi = OrderbookAbi__factory_1._abi;
// First we create a DataSource - component,
// that defines where to get the data and what data should we get.
const dataSource = new fuel_stream_1.DataSourceBuilder()
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
const database = new typeorm_store_1.TypeormDatabase();
// Now we are ready to start data processing
(0, batch_processor_1.run)(dataSource, database, async (ctx) => {
    // Block items that we get from `ctx.blocks` are flat JS objects.
    //
    // We can use `augmentBlock()` function from `@subsquid/fuel-objects`
    // to enrich block items with references to related objects.
    let contracts = new Map();
    let blocks = ctx.blocks.map(fuel_objects_1.augmentBlock);
    for (let block of blocks) {
        const receipts = [];
        for (let receipt of block.receipts) {
            if (receipt.contract == ORDERBOOK_ID &&
                receipt.transaction?.status.type != "FailureStatus") {
                receipts.push({
                    type: fuels_1.ReceiptType.LogData,
                    digest: (0, util_internal_1.assertNotNull)(receipt.digest),
                    id: receipt.contract,
                    is: new fuels_1.BN(receipt.is?.toString()),
                    len: new fuels_1.BN(receipt.len?.toString()),
                    pc: new fuels_1.BN(receipt.pc?.toString()),
                    ptr: new fuels_1.BN(receipt.ptr?.toString()),
                    val0: new fuels_1.BN(receipt.ra?.toString()),
                    val1: new fuels_1.BN(receipt.rb?.toString()),
                    data: (0, util_internal_1.assertNotNull)(receipt.data),
                });
            }
        }
        let logs = (0, fuels_1.getDecodedLogs)(receipts, abi);
        let orders = new Map();
        let createEvents = [];
        let orderChangeEvents = [];
        let tradeEvents = [];
        try {
            logs.map(async (log) => {
                // MarketCreateEvent
                if ((0, isEvent_1.default)("MarketCreateEvent", log, abi)) {
                    const idSource = `${log.asset_decimals}-${log.asset_id.bits}-${(0, tai64ToDate_1.default)(log.timestamp)}-${log.tx_id}`;
                    const id = crypto_1.default.createHash("sha256").update(idSource).digest("hex");
                    let event = new model_1.SpotMarketCreateEvent({
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
                if ((0, isEvent_1.default)("OrderChangeEvent", log, abi)) {
                    const timestamp = (0, tai64ToDate_1.default)(log.timestamp);
                    const idSource = `${log.tx_id}-${timestamp}-${log.order_id}`;
                    const id = crypto_1.default.createHash("sha256").update(idSource).digest("hex");
                    let event = new model_1.SpotOrderChangeEvent({
                        id: id,
                        timestamp: (0, tai64ToDate_1.default)(log.timestamp).toString(),
                        txId: log.tx_id,
                        orderId: log.order_id,
                        newBaseSize: log.new_base_size,
                        identifier: log.identifier,
                    });
                    let spotOrder = undefined;
                    if (log.order) {
                        let existingOrder = await ctx.store.get(model_1.SpotOrder, log.order.id);
                        if (existingOrder) {
                            spotOrder = existingOrder;
                            spotOrder.baseSize = log.order.base_size.value.toString();
                            orders.set(log.order.id, spotOrder);
                        }
                        else {
                            let order = log.order;
                            console.log("order");
                            console.log(order);
                            spotOrder = new model_1.SpotOrder({
                                id: order.id,
                                trader: order.trader.bits,
                                baseToken: order.base_token.bits,
                                baseSize: order.base_size.value.toString(),
                                basePrice: order.base_price.toString(),
                                timestamp: (0, tai64ToDate_1.default)(log.timestamp).toString(),
                                orderType: order.base_size === 0n
                                    ? undefined
                                    : order.base_size.negative
                                        ? model_1.SpotOrderType.sell
                                        : model_1.SpotOrderType.buy,
                            });
                            //console.log("spotOrder");
                            // console.log(spotOrder);
                            orders.set(order.id, spotOrder);
                        }
                    }
                    //await ctx.store.upsert(spotOrder);
                    console.log(spotOrder);
                    //console.log(event);
                    //await ctx.store.upsert(event);
                    orderChangeEvents.push(event);
                }
                // TradeEvent
                if ((0, isEvent_1.default)("TradeEvent", log, abi)) {
                    const idSource = `${log.base_token.bits}-${log.order_matcher.bits}-${log.seller.bits}-${log.buyer.bits}-${log.trade_size}-${log.trade_price}-${log.sell_order_id}-${log.buy_order_id}-${(0, tai64ToDate_1.default)(log.timestamp)}-${log.tx_id}`;
                    const id = crypto_1.default.createHash("sha256").update(idSource).digest("hex");
                    let event = new model_1.SpotTradeEvent({
                        id: id,
                        timestamp: (0, tai64ToDate_1.default)(log.timestamp).toString(),
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
        }
        catch (e) {
            console.error(e);
        }
        await ctx.store.upsert([...orders.values()]);
        // await ctx.store.upsert(createEvents);
        await ctx.store.upsert(orderChangeEvents);
        await ctx.store.upsert(tradeEvents);
    }
});
//# sourceMappingURL=main.js.map