import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {SpotOrderType} from "./_spotOrderType"

@Entity_()
export class SpotOrder {
    constructor(props?: Partial<SpotOrder>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("varchar", {length: 4, nullable: true})
    orderType!: SpotOrderType | undefined | null

    @StringColumn_({nullable: true})
    trader!: string | undefined | null

    @StringColumn_({nullable: true})
    baseToken!: string | undefined | null

    @StringColumn_({nullable: false})
    baseSize!: string

    @BigIntColumn_({nullable: true})
    basePrice!: bigint | undefined | null

    @StringColumn_({nullable: true})
    timestamp!: string | undefined | null
}
