import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {SpotOrder} from "./spotOrder.model"

@Entity_()
export class SpotTradeEvent {
    constructor(props?: Partial<SpotTradeEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    baseToken!: string

    @StringColumn_({nullable: false})
    orderMatcher!: string

    @StringColumn_({nullable: false})
    seller!: string

    @StringColumn_({nullable: false})
    buyer!: string

    @BigIntColumn_({nullable: false})
    tradeSize!: bigint

    @BigIntColumn_({nullable: false})
    tradePrice!: bigint

    @Index_()
    @ManyToOne_(() => SpotOrder, {nullable: true})
    sellOrder!: SpotOrder

    @Index_()
    @ManyToOne_(() => SpotOrder, {nullable: true})
    buyOrder!: SpotOrder

    @StringColumn_({nullable: false})
    timestamp!: string

    @StringColumn_({nullable: false})
    txId!: string
}
