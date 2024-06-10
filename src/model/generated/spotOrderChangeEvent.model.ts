import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class SpotOrderChangeEvent {
    constructor(props?: Partial<SpotOrderChangeEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: true})
    orderId!: string | undefined | null

    @StringColumn_({nullable: true})
    newBaseSize!: string | undefined | null

    @StringColumn_({nullable: true})
    identifier!: string | undefined | null

    @StringColumn_({nullable: true})
    timestamp!: string | undefined | null

    @StringColumn_({nullable: true})
    txId!: string | undefined | null
}
