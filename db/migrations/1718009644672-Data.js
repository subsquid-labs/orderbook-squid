module.exports = class Data1718009644672 {
    name = 'Data1718009644672'

    async up(db) {
        await db.query(`CREATE TABLE "spot_market_create_event" ("id" character varying NOT NULL, "asset_id" text, "asset_decimals" integer, "timestamp" text, "tx_id" text, CONSTRAINT "PK_7f2d8de29c96b0da94ac72fabf7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "spot_order_change_event" ("id" character varying NOT NULL, "order_id" text, "new_base_size" text, "identifier" text, "timestamp" text, "tx_id" text, CONSTRAINT "PK_b679aa3d07de75efd6c8cc0b5a9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "spot_order" ("id" character varying NOT NULL, "order_type" character varying(4), "trader" text, "base_token" text, "base_size" text, "base_price" numeric, "timestamp" text, CONSTRAINT "PK_072f4b1d3bfcf52fc5927aa75ed" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "spot_trade_event" ("id" character varying NOT NULL, "base_token" text, "order_matcher" text, "seller" text, "buyer" text, "trade_size" numeric, "trade_price" numeric, "sell_order" text, "buy_order" text, "timestamp" text, "tx_id" text, CONSTRAINT "PK_a7374ce29eff3b302670e6cf0c7" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "spot_market_create_event"`)
        await db.query(`DROP TABLE "spot_order_change_event"`)
        await db.query(`DROP TABLE "spot_order"`)
        await db.query(`DROP TABLE "spot_trade_event"`)
    }
}
