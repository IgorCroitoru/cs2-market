import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ItemCreationAttr, ItemModel } from "./item.model";
import { Transaction, WhereOptions } from "sequelize";
import { customSlugify } from "src/utils";

@Injectable()
export class ItemService{
    constructor(@InjectModel(ItemModel) public itemModel: typeof ItemModel){

    }

    async create(item: ItemCreationAttr, transaction?:Transaction){
        try{
            return await this.itemModel.create(item,{transaction})
        }catch(e){
            throw e
        }
    }
    async findOne(where_clause: Partial<ItemModel>, transaction?:Transaction){
        try {
            return await this.itemModel.findOne({where:where_clause,transaction})
        } catch (error) {
            throw error
        }
    }

    async findAll(where:WhereOptions<ItemModel>, transaction?:Transaction){
        try{
            return await this.itemModel.findAll({where, transaction})
        }catch(e){
            throw e
        }
    }
    async createIfNotExist(item: ItemCreationAttr, transaction?:Transaction){
        try{
            return await this.itemModel.upsert(item, {transaction})
        }catch(e){
            throw e
        }
    }
    async bulkCreate(items: ItemCreationAttr[], transaction?:Transaction){
        try{
            items.forEach(async item => {
                if (item.market_hash_name) {
                    item.slug = await this.itemModel.generateUniqueSlug(item.market_hash_name);
                }
            });
            return await this.itemModel.bulkCreate(items, {transaction})
        }catch(e){
            throw e
        }
    }
    async bulkUpsert(items: ItemCreationAttr[], transaction?: Transaction) {
        try {
            // Generate slugs for all items asynchronously
            for (const item of items) {
                if (item.market_hash_name) {
                    item.slug = await this.itemModel.generateUniqueSlug(item.market_hash_name);
                }
            }
    
            
            // Perform bulk create/upsert
            return await this.itemModel.bulkCreate(items, {
                transaction,
                updateOnDuplicate: ['market_hash_name']  // Fields to update on conflict
            });
        } catch (e) {
            console.error('Error in bulkUpsert:', e);  // Log error for debugging
            throw e;
        }
    }
    
    
    
    
}