import { Column, DataType, ForeignKey, PrimaryKey, Table, Model, HasMany, BelongsTo, AfterFind, AutoIncrement, BeforeSave  } from "sequelize-typescript";
import { Col } from "sequelize/types/utils";
import { BotModel } from "src/Bots/bots.model";
import { CategoryModel } from "src/category/category.model";
import { Sticker } from "src/Entities/ItemInv";
import { TypeModel } from "src/item-types/type.model";
import { ItemModel } from "src/item/item.model";
import { EExterior, ERarity } from "src/product/enums";
import { CEeconItemRehydration, hydrateItem, truncateFloat } from "src/utils";
import CEconItem from "steamcommunity/classes/CEconItem";
import { OnlyProperties } from "src/Bots/bot-info-payload";

export type BotItemSticker = {
    name: string
    wear?: number
    slot?: number
}

export enum EBotItemStatus {
    AVAILABLE = 'AVAILABLE',
    NOT_AVAILABLE = 'NOT AVAILABLE',
    PROCESSING = 'PROCESSING'
}

export interface BotItemCreationAttr {
    ceeconitem: CEconItem
    item_id: number
    name_tag?: string
    paint_wear?: number //float
    market_hash_name: string
    exterior?: EExterior | null
    color: string
    tradable_after?: Date
    paint_seed?: number
    st?:boolean
    souvenir?: boolean
    type_id?: number,
    rarity: ERarity
    category_id?: number,
    assetid: string,
    bot_id: number,
    status?: EBotItemStatus,
    stickers: BotItemSticker[]
}

@Table({
    tableName: 'bot_item_inventory',
    indexes: [
        {fields:['market_hash_name']},
        {fields:['name_tag']},
        {fields:['paint_wear']},
        {fields:['exterior']},
        {fields:['tradable_after']},
        {fields:['paint_seed']},
        {fields:['st']},
        {fields:['souvenir']},
        {fields:['type_id']},
        {fields:['rarity']},
        {fields:['category_id']},
        {fields:['assetid']},
        {fields:['bot_id']},
        {
            //because assetid is not unique across all cs items, it is unique only in bot inventory
            unique: true, 
            fields: ['assetid', 'bot_id'], 
            name: 'unique_assetid_botid' 
        },
        {
            //composite index
            fields: ['status', 'bot_id'],
            name: 'idx_item_status_bot_id'
        }

    ]
})
export class BotItemInventoryModel extends Model<BotItemInventoryModel,BotItemCreationAttr>{
    
    @PrimaryKey
    @AutoIncrement
    @Column({type:DataType.BIGINT})
    id: number

    @Column({
        type: DataType.JSONB,
        allowNull: false
    })
    ceeconitem: CEconItem

    @Column({
        type:DataType.STRING(11),
        allowNull: false
        
    })
    assetid: string

    @Column({
        type:DataType.DATE,
    })
    tradable_after: Date | null
    @Column({
        type: DataType.SMALLINT,
        allowNull: false
    })
    @ForeignKey(()=> BotModel)
    @Column({
        type:DataType.SMALLINT,
        allowNull:false
    })
    bot_id: number


    @Column({
        type:DataType.STRING,
        allowNull: false
    })
    market_hash_name: string

    @Column({
        type:DataType.STRING(6),
        allowNull: false
    })
    color: string

    @ForeignKey(()=>ItemModel)
    @Column({
        type:DataType.INTEGER,
    })
    item_id:number
    
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    st: boolean

    @Column({
        type:DataType.STRING,
        allowNull: true,
        defaultValue: null
    })
    name_tag:string | null


    @Column({
        type:DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    souvenir: boolean

    @Column({
        type: DataType.ENUM(...Object.values(ERarity)),
        allowNull: false
    })
    rarity: ERarity

    @Column({
        type: DataType.DECIMAL(19,18),
        defaultValue: null
    })
    paint_wear: number | null //float

    @Column({
        type: DataType.SMALLINT,
        allowNull: true,
        validate: {
            min: 0,
            max: 1000
        }
    })
    paint_seed: number | null//pattern

   

    @ForeignKey(()=>TypeModel)
    @Column({
        type:DataType.SMALLINT,
    })
    type_id: number

    @ForeignKey(()=> CategoryModel)
    @Column({
        type:DataType.SMALLINT,
    })
    category_id: number | null


    @Column({
        type:DataType.ENUM(...Object.values(EExterior)),
        defaultValue: null
    })
    exterior: EExterior | null

    @Column({
        type: DataType.ENUM(...Object.values(EBotItemStatus)),
        defaultValue: 'AVAILABLE'
    })
    status: EBotItemStatus

    @Column({
        type: DataType.JSONB,
        defaultValue: []
    })
    stickers: BotItemSticker[]

    @BelongsTo(()=>TypeModel, {foreignKey:'type_id', targetKey: 'id'})
    type: TypeModel
    
    @BelongsTo(()=>CategoryModel, {foreignKey: 'category_id', targetKey: 'id'})
    category: CategoryModel

    @BelongsTo(()=>BotModel)
    bot:BotModel
    
    @AfterFind
    static rehydrateCEeconItem(instance: BotItemInventoryModel){
        if(instance){
            instance.ceeconitem = hydrateItem(instance.ceeconitem, CEconItem)
        }
        
    }

    @BeforeSave
    static truncateDecimal(instance: BotItemInventoryModel){
       if(instance.paint_wear){
        instance.paint_wear = truncateFloat(instance.paint_wear)
       }
    }
}