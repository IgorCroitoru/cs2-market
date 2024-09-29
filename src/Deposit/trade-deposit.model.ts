import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { DepositModel } from "./deposit.model";
import { TradeDeal } from "src/Deals/deal.model";
import { Col } from "sequelize/types/utils";
import { Op } from "sequelize";
export type TradeDepositStatusType = 'pending' | 'completed' | 'failed'
export interface TradeDepositCreationAttr{
    deposit_id: number,
    amount: number,
    status?: TradeDepositStatusType,
    trade_deal_id?: number | null
}
@Table({
    tableName: 'trade_deposit',
    indexes:[
        {
            name: 'idx_dep_id',
            fields: ['deposit_id']
        },
        {
            name: 'idx_trade_deposit_deal_id',
            fields: ['trade_deal_id'],
            where:{
              trade_deal_id: { [Op.ne]: null }
            }
        }
    ]
})
export class TradeDepositModel extends Model<TradeDepositModel, TradeDepositCreationAttr>{
    @PrimaryKey
    @AutoIncrement
    @Column({
        type:DataType.BIGINT
    })
    id: number

    @ForeignKey(()=> DepositModel)
    @Column({
        type:DataType.BIGINT,
        allowNull: false
    })
    deposit_id: number

    @ForeignKey(()=> TradeDeal)
    @Column({
        type: DataType.BIGINT,
        defaultValue: null
    })
    trade_deal_id: number | null

    @Column({
        type:DataType.DECIMAL(10,2),
        allowNull: false
    })
    amount: number

    @Column({
        type:DataType.ENUM('pending' , 'completed' , 'failed'),
        defaultValue: 'pending',
        allowNull: false
    })
    status: TradeDepositStatusType

    @BelongsTo(()=>DepositModel, {foreignKey: 'deposit_id', targetKey: 'id'})
    deposit: DepositModel

    @BelongsTo(()=> TradeDeal, {foreignKey: 'trade_deal_id', targetKey: 'id'})
    trade_deal: TradeDeal


}