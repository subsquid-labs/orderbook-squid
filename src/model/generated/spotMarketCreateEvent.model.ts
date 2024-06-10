import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class SpotMarketCreateEvent {
    constructor(props?: Partial<SpotMarketCreateEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: true})
    assetId!: string | undefined | null

    @IntColumn_({nullable: true})
    assetDecimals!: number | undefined | null

    @StringColumn_({nullable: true})
    timestamp!: string | undefined | null

    @StringColumn_({nullable: true})
    txId!: string | undefined | null
}
