module.exports = class Data1718634317065 {
    name = 'Data1718634317065'

    async up(db) {
        await db.query(`ALTER TABLE "spot_order" DROP COLUMN "order_type"`)
        await db.query(`ALTER TABLE "spot_order" ADD "order_type" character varying(4)`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "spot_order" ADD "order_type" character varying(6)`)
        await db.query(`ALTER TABLE "spot_order" DROP COLUMN "order_type"`)
    }
}
