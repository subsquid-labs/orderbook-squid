import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {SpotOrder} from "./spotOrder.model"

@Entity_()
export class SpotOrderChangeEvent {
    constructor(props?: Partial<SpotOrderChangeEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => SpotOrder, {nullable: true})
    order!: SpotOrder

    @StringColumn_({nullable: false})
    newBaseSize!: string

    @StringColumn_({nullable: true})
    identifier!: string | undefined | null

    @StringColumn_({nullable: true})
    timestamp!: string | undefined | null

    @StringColumn_({nullable: true})
    txId!: string | undefined | null
}
