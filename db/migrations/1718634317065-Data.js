module.exports = class Data1718631115405 {
    name = 'Data1718631115405'

    async up(db) {
         await db.query(`DROP TABLE "spot_order" CASCADE`)
        await db.query(`DROP TABLE "spot_order_change_event" CASCADE`)
        await db.query(`DROP TABLE "spot_market_create_event" CASCADE`)
        await db.query(`DROP TABLE "spot_trade_event" CASCADE`)
        await db.query(`CREATE TABLE "spot_order" ("id" character varying NOT NULL, "order_type" character varying(6), "trader" text, "base_token" text, "base_size" text NOT NULL, "base_price" numeric, "timestamp" text, CONSTRAINT "PK_072f4b1d3bfcf52fc5927aa75ed" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "spot_order_change_event" ("id" character varying NOT NULL, "new_base_size" text NOT NULL, "identifier" text, "timestamp" text, "tx_id" text, "order_id" character varying, CONSTRAINT "PK_b679aa3d07de75efd6c8cc0b5a9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_316a13db482ca7e2a781fc079c" ON "spot_order_change_event" ("order_id") `)
        await db.query(`CREATE TABLE "spot_market_create_event" ("id" character varying NOT NULL, "asset_id" text NOT NULL, "asset_decimals" integer NOT NULL, "timestamp" text NOT NULL, "tx_id" text NOT NULL, CONSTRAINT "PK_7f2d8de29c96b0da94ac72fabf7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "spot_trade_event" ("id" character varying NOT NULL, "base_token" text NOT NULL, "order_matcher" text NOT NULL, "seller" text NOT NULL, "buyer" text NOT NULL, "trade_size" numeric NOT NULL, "trade_price" numeric NOT NULL, "timestamp" text NOT NULL, "tx_id" text NOT NULL, "sell_order_id" character varying, "buy_order_id" character varying, CONSTRAINT "PK_a7374ce29eff3b302670e6cf0c7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_19e4b0fe23462a5542ec67a418" ON "spot_trade_event" ("sell_order_id") `)
        await db.query(`CREATE INDEX "IDX_0e27ac32741b84495a6072d7a9" ON "spot_trade_event" ("buy_order_id") `)
        await db.query(`ALTER TABLE "spot_order_change_event" ADD CONSTRAINT "FK_316a13db482ca7e2a781fc079cb" FOREIGN KEY ("order_id") REFERENCES "spot_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "spot_trade_event" ADD CONSTRAINT "FK_19e4b0fe23462a5542ec67a418f" FOREIGN KEY ("sell_order_id") REFERENCES "spot_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "spot_trade_event" ADD CONSTRAINT "FK_0e27ac32741b84495a6072d7a9c" FOREIGN KEY ("buy_order_id") REFERENCES "spot_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "spot_order"`)
        await db.query(`DROP TABLE "spot_order_change_event"`)
        await db.query(`DROP INDEX "public"."IDX_316a13db482ca7e2a781fc079c"`)
        await db.query(`DROP TABLE "spot_market_create_event"`)
        await db.query(`DROP TABLE "spot_trade_event"`)
        await db.query(`DROP INDEX "public"."IDX_19e4b0fe23462a5542ec67a418"`)
        await db.query(`DROP INDEX "public"."IDX_0e27ac32741b84495a6072d7a9"`)
        await db.query(`ALTER TABLE "spot_order_change_event" DROP CONSTRAINT "FK_316a13db482ca7e2a781fc079cb"`)
        await db.query(`ALTER TABLE "spot_trade_event" DROP CONSTRAINT "FK_19e4b0fe23462a5542ec67a418f"`)
        await db.query(`ALTER TABLE "spot_trade_event" DROP CONSTRAINT "FK_0e27ac32741b84495a6072d7a9c"`)
    }
}
