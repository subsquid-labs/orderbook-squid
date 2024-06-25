import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class TradeOrderEvent {
    constructor(props?: Partial<TradeOrderEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    baseSellOrderId!: string

    @Index_()
    @StringColumn_({nullable: false})
    baseBuyOrderId!: string

    @Index_()
    @StringColumn_({nullable: false})
    txId!: string

    @Index_()
    @StringColumn_({nullable: false})
    orderMatcher!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    tradeSize!: bigint

    @Index_()
    @BigIntColumn_({nullable: false})
    tradePrice!: bigint

    @StringColumn_({nullable: false})
    timestamp!: string
}
