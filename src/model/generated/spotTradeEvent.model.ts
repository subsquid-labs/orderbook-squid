import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class SpotTradeEvent {
    constructor(props?: Partial<SpotTradeEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: true})
    baseToken!: string | undefined | null

    @StringColumn_({nullable: true})
    orderMatcher!: string | undefined | null

    @StringColumn_({nullable: true})
    seller!: string | undefined | null

    @StringColumn_({nullable: true})
    buyer!: string | undefined | null

    @BigIntColumn_({nullable: true})
    tradeSize!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    tradePrice!: bigint | undefined | null

    @StringColumn_({nullable: true})
    sellOrder!: string | undefined | null

    @StringColumn_({nullable: true})
    buyOrder!: string | undefined | null

    @StringColumn_({nullable: true})
    timestamp!: string | undefined | null

    @StringColumn_({nullable: true})
    txId!: string | undefined | null
}
