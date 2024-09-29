import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BotItemCreationAttr, BotItemInventoryModel, BotItemSticker } from "./bot-inventory.model";
import { Transaction } from "sequelize";
import { ExtendedMEconItemExchange } from "src/Bots/bot-info-payload";
import { ItemService } from "src/item/item.service";
import { TypeService } from "src/item-types/type.service";
import { CategoryService } from "src/category/category.service";
import { CEeconItemRehydration, getItemCategory, getItemExterior, getNameTag } from "src/utils";
import { Sticker } from "src/Bots/bot-info-payload";
import { Op } from "sequelize";
import CEconItem from "steamcommunity/classes/CEconItem";
@Injectable()
export class BotItemInventoryService{
    private logger: Logger = new Logger(BotItemInventoryService.name)
    constructor(@InjectModel(BotItemInventoryModel) private botInventory:typeof BotItemInventoryModel,
        private readonly itemService: ItemService,
        private readonly typeService: TypeService,
        private readonly categoryService: CategoryService
                )                
{}



    async findOne(where_clause: Partial<BotItemInventoryModel>, transaction?:Transaction){
        try {
            return await this.botInventory.findOne({where:where_clause, transaction})
        } catch (error) {
            throw error
        }
    }

    async findAll(where_clause: Partial<BotItemInventoryModel>, transaction?:Transaction){
        try {
            return await this.botInventory.findAll({where:where_clause, transaction})
        } catch (error) {
            throw error
        }
    }

    async update(filed: Partial<BotItemInventoryModel>, where: Partial<BotItemCreationAttr>,transaction?:Transaction){
        return await this.botInventory.update(filed, {where, transaction})
    }

    async create(item: BotItemCreationAttr, transaction?: Transaction){
        try{
            return await this.botInventory.create(item, {transaction})
        }catch(e){
            throw e
        }
    }

    async createFromMEconItem(item: ExtendedMEconItemExchange, bot_id: number, t?: Transaction) {
        const transaction = t ?? await this.botInventory.sequelize.transaction();
    
        try {
          
            const item_db = await this.itemService.findOne({ market_hash_name: item.market_hash_name });
            if (!item_db) this.logger.warn(`No item in db found with name: ${item.market_hash_name}`)
    
            const type = item.getTag('Type').name;
            const type_db = await this.typeService.findOne({ name: type });
            if (!type_db) this.logger.warn(`No item in db found with type: ${item.type}`)
    
            const category = getItemCategory(item);
            const categoryDb = category ? await this.categoryService.findOne({ name: category }) : null;
            const new_item: BotItemCreationAttr = {
                ceeconitem: item as CEconItem,
                exterior: getItemExterior(item),
                color: item.getTag('Rarity').color,
                type_id: type_db?.id || null,
                rarity: item.getTag('Rarity').name,
                item_id: item_db?.id || null,
                market_hash_name: item.market_hash_name,
                assetid: item.assetid.toString(),
                bot_id,
                category_id: categoryDb.id,
                paint_seed: item.paint_seed ?? 0,
                paint_wear: item.paint_wear ? item.paint_wear: null,
                name_tag: getNameTag(item.fraudwarnings),
                st: item.getTag('Quality')?.name === 'StatTrak™',
                souvenir: item.getTag('Quality')?.name === 'Souvenir',
                stickers: []
            };
    
    
            if (item.stickers) {
                const ids = item.stickers.map(i => i.sticker_id);
                const item_stickers_db = await this.itemService.findAll({ id: { [Op.in]: ids } }, transaction);
    
                // Create a map for faster lookups
                const stickerMap = new Map(item_stickers_db.map(i => [i.custom_id, i.market_hash_name]));
    
                new_item.stickers = item.stickers.map(s => {
                    if(stickerMap.get(s.sticker_id)){
                        return {
                            name: stickerMap.get(s.sticker_id),
                            wear: s.wear,
                            slot: s.slot,
                        }
                    }
                });
                
            }
            const createdItem = await this.create(new_item, transaction);

    
            t ?? await transaction.commit();
            return createdItem;
        } catch (e) {
            t ?? await transaction.rollback();
            this.logger.error(`Error saving item with assetid = ${item.new_assetid} : ${e.stack}`)
        }
    }
    
   
   
    
}