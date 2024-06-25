import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class MatchOrderEvent {
    constructor(props?: Partial<MatchOrderEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    orderId!: string

    @StringColumn_({nullable: false})
    txId!: string

    @StringColumn_({nullable: false})
    asset!: string

    @StringColumn_({nullable: false})
    orderMatcher!: string

    @StringColumn_({nullable: false})
    owner!: string

    @StringColumn_({nullable: false})
    counterparty!: string

    @BigIntColumn_({nullable: false})
    matchSize!: bigint

    @BigIntColumn_({nullable: false})
    matchPrice!: bigint

    @StringColumn_({nullable: false})
    timestamp!: string
}
