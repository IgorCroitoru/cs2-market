import { Op } from "sequelize";
import { Table ,Model, PrimaryKey, Column, DataType, ForeignKey, BelongsTo, HasOne, AutoIncrement, HasMany} from "sequelize-typescript";
import { BotModel } from "src/Bots/bots.model";
import { DepositModel } from "src/Deposit/deposit.model";
import { User } from "src/users/users.model";
import { TradeDealDetailModel } from "./deal-deposit-items.model";
import { TradeDepositModel } from "src/Deposit/trade-deposit.model";

export type TradeStatusType = 'needsConf' | 'pending' | 'assigned' | 'active' | 'accepted' | 'cancelled' | 'declined' | 'failed';
export type TradeDealType = 'deposit' | 'sale'
export type TradeDealCreationAttr = {
  userId: number;
  status: TradeStatusType;
  type: TradeDealType
  } & (
    | { saleId: number; depositId?: never } 
    | { depositId: number; saleId?: never }
  );

type OfferErrorDetails = {
    message: string; // Required property
    [key: string]: any; // Allows additional properties of any type if needed
}
export interface OfferErrorCreationAttr{
  trade_deal_id?: number | null;
  error: OfferErrorDetails;
}

@Table({
  tableName: 'deal_errors',
  timestamps: true,
  indexes: [
    {
      name: 'idx_error_trade_deal_id',
      fields: ['trade_deal_id'],
     
    },
  ],
})
export class OfferErrorModel extends Model<OfferErrorModel,OfferErrorCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() =>TradeDeal)
  @Column({ type: DataType.BIGINT, allowNull: true, defaultValue: null })
  trade_deal_id: number;
  
  @Column({type: DataType.JSONB, allowNull: false})
  error: OfferErrorDetails;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt?: Date;
}


@Table({
    tableName: "trade_deals",
    indexes: [
        {
          name: 'idx_botid_deals',
          fields: ['botId'],
          where: {
            status: {
              [Op.notIn]: ['pending', 'active', 'needsConf','assigned'],
            },
          },
        },
        {
          name: 'idx_deposit_userid',
          fields: ['userId'],
        },
       
       
       
      ],
      timestamps:false
})
export class TradeDeal extends Model<TradeDeal,TradeDealCreationAttr>{
    @PrimaryKey
    @AutoIncrement
    @Column({
        type:DataType.BIGINT
    })
    id: number

    @ForeignKey(() => User)
    @Column({ type: DataType.BIGINT, allowNull: false })
    userId: number;


    @ForeignKey(() => BotModel)
    @Column({ type: DataType.BIGINT, allowNull: true })
    botId: number;

    @Column({
      type: DataType.ENUM('deposit', 'sale')
    })
    type: TradeDealType
    @Column({
        type: DataType.ENUM('needsConf', 'pending', 'assigned', 'active', 'accepted', 'cancelled', 'declined', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      })
    status: TradeStatusType

    @Column({
        type:DataType.STRING(14),
        allowNull:true,
        defaultValue: null
      })
    offerId: string | null

    @Column({
        type: DataType.BIGINT,
        allowNull: true,
        defaultValue: null,
      })
    trade_offer_expiry_at: number | null;

    @Column({
        type: DataType.BIGINT,
        allowNull: true,
        defaultValue:null,
    })
    trade_offer_created_at: number | null;

    @Column({
        type: DataType.BIGINT,
        allowNull: true,
        defaultValue: null,
    })
    trade_offer_finished_at: number | null;
      

    @HasOne(()=> OfferErrorModel, {onDelete: 'CASCADE', foreignKey: 'trade_deal_id', sourceKey: 'id'})
    error: OfferErrorModel

    @HasMany(()=>TradeDealDetailModel, {onDelete: "CASCADE", foreignKey: "trade_deal_id", sourceKey: 'id'})
    details: TradeDealDetailModel

    @HasOne(() => TradeDepositModel, { onDelete: 'CASCADE', foreignKey: 'trade_deal_id', sourceKey: 'id' }) // TradeDeposit holds the dealId
    trade_deposit: TradeDepositModel;
}


    
  
  
  