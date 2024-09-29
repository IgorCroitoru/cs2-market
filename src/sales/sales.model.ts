import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";

export type SaleStatusType = 'completed' | 'failed' | 'pending'

export interface SaleCreationAttr {
    buyer_id: number
    status: string
    amount: number
    purchase_date?: number;
}
@Table({
    tableName: 'sales'
})
export class SaleModel extends Model<SaleModel>{
    @PrimaryKey
    @Column({
        type: DataType.BIGINT
    })
    id:number

    @ForeignKey(()=>User)
    @Column({
        type:DataType.BIGINT,
        allowNull: false
    })
    buyer_id: number

    @Column({
        type: DataType.DATE,
        defaultValue: Date.now(),
      })
    purchase_date: number;

}