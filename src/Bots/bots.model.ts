import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { HasMany } from "sequelize-typescript";
import { Col } from "sequelize/types/utils";
import { TradeDeal } from "src/Deals/deal.model";
export interface BotCreationAttributes{
    botId64: string
    ready: boolean
    items_count:number
    username: string
}

export interface ExtendedBotModel extends BotModel {
  potential_items_count?:number
}

@Table({ tableName: 'bots',
    indexes:[
      {
        name: 'idx_botId64',
        fields: ['botId64']
      }
    ],
    timestamps:true
 })
export class BotModel extends Model<BotModel,BotCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column({
      type: DataType.SMALLINT,
      field: 'botId'
    })
    botId: number;
  
    @Unique
    @Column({
      type: DataType.STRING,
      allowNull: false,
      field: 'botId64',
      unique:true
    })
    botId64: string;
  
    @Default(false)
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false
    })
    ready: boolean;
  
    @Default(0)
    @Column({
      type: DataType.SMALLINT,
      allowNull: false
    })
    items_count: number;
    
    @Column({
      type:DataType.STRING(30),
      allowNull:false
    })
    username: string
    @HasMany(()=>TradeDeal)
    deals: TradeDeal[];
  }