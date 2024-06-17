module.exports = class Data1718617278637 {
    name = 'Data1718617278637'

    async up(db) {
        await db.query(`ALTER TABLE "spot_order" ALTER COLUMN "base_size" SET NOT NULL`)
        await db.query(`ALTER TABLE "spot_order_change_event" ALTER COLUMN "new_base_size" SET NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "spot_order" ALTER COLUMN "base_size" DROP NOT NULL`)
        await db.query(`ALTER TABLE "spot_order_change_event" ALTER COLUMN "new_base_size" DROP NOT NULL`)
    }
}
