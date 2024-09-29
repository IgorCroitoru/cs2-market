import { Model, Column, Table, DataType, HasMany, PrimaryKey, HasOne } from 'sequelize-typescript';
import { TradeDeal } from 'src/Deals/deal.model';
import { TradeDepositModel } from './trade-deposit.model';

export type DepositType = 'trade_offer'
export type DepositStatusType = 'pending'| 'completed' | 'failed' | 'partial'

export interface DepositCreationAttr{
    type: DepositType,
    status: DepositStatusType,
    userId: number,
    amount: number
}
@Table({
  tableName: 'deposits',
  timestamps: true,
  indexes:[
    {
        name:"idx_deposit_userId",
        fields: ["userId"]
    }
  ]
})
export class DepositModel extends Model<DepositModel,DepositCreationAttr> {
  
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.ENUM('trade_offer'),
    allowNull: false,
  })
  type: DepositType  // E.g., 'trade_offer', 'payment', etc.

  @Column({
    type: DataType.ENUM('pending', 'completed', 'failed', 'partial'),
    allowNull: true,
  })
  status: DepositStatusType;  // E.g., 'pending', 'completed', 'failed'
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.DECIMAL(10,2),
    allowNull: false,
  })
  amount: number;

  @HasMany(() => TradeDepositModel, {
    foreignKey: 'deposit_id',
    onDelete: 'CASCADE',
    sourceKey: 'id'
  })
  trade_deposits: TradeDepositModel[];
  
}

