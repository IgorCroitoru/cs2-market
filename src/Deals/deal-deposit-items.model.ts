import { Table,Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { DealModule } from "./deal.module";
import { TradeDeal } from "./deal.model";
import CEconItem from "steamcommunity/classes/CEconItem";

export interface TradeDealDetailCreationAttr{
    depositItemId?: number;
    trade_deal_id: number
    price: number;
    assetId: string;
    ceeconitem:CEconItem
}

@Table({
    tableName: 'deal_deposit_details',
    indexes: [
        {
            name: "idx_deal_items_assetId",
            fields: ["assetId"]
        },
        {
            name: "idx_item_deal_id",
            fields: ['trade_deal_id']
        }
    ]
})
export class TradeDealDetailModel extends Model<TradeDealDetailModel,TradeDealDetailCreationAttr>{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @ForeignKey(() => TradeDeal)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    trade_deal_id: number;
  
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    price: number;
  
    @Column({
        type: DataType.STRING(11),
        allowNull: false,
    })
    assetId: string;
  
    @Column({
        type: DataType.STRING(11),
        allowNull: true,
    })
    newAssetId: string; 

    @Column({
        type: DataType.JSONB,
        allowNull: false,
    })
    ceeconitem: CEconItem;
  
    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    createdAt?: Date;
  
    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    updatedAt?: Date;
  
    @BelongsTo(()=>TradeDeal, { foreignKey: 'trade_deal_id', targetKey: 'id' })
    trade_deal: TradeDeal
}