import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class SpotMarketCreateEvent {
    constructor(props?: Partial<SpotMarketCreateEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    assetId!: string

    @IntColumn_({nullable: false})
    assetDecimals!: number

    @StringColumn_({nullable: false})
    timestamp!: string

    @StringColumn_({nullable: false})
    txId!: string
}
