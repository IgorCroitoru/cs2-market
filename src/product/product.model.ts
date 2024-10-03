import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { BotItemInventoryModel } from "src/bot-inventory/bot-inventory.model";
import { EExterior, ERarity } from "./enums";
import { ItemModel } from "src/item/item.model";
import { TypeModel } from "src/item-types/type.model";
import { CategoryModel } from "src/category/category.model";

export interface ProductCreationAttr {
    // listed?: boolean
    price: number,
    bot_item_id: number
}

@Table({
    tableName: 'product',
    indexes:[
        {fields: ['price']},
        {fields: ['bot_item_id']}
    ]
})
export class ProductModel extends Model<ProductModel,ProductCreationAttr>{

    @PrimaryKey
    @AutoIncrement
    @Column({
        type:DataType.BIGINT,
    })
    id: number

   
   
    // @Column({
    //     type:DataType.BOOLEAN,
    //     defaultValue: false
    // })
    // listed:boolean

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
      })
    price:number

    @ForeignKey(()=> BotItemInventoryModel)
    @Column({
        type:DataType.BIGINT,
        unique: true
    })
    bot_item_id:number

    @BelongsTo(()=>BotItemInventoryModel, {foreignKey: 'bot_item_id', targetKey: 'id'})
    bot_item: BotItemInventoryModel
    
}