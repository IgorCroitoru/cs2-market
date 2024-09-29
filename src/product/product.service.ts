import { ConflictException, HttpCode, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ProductCreationAttr, ProductModel } from "./product.model";
import { Transaction } from "sequelize";
import { BotItemInventoryModel } from "src/bot-inventory/bot-inventory.model";
import { BotItemInventoryService } from "src/bot-inventory/bot-inventory.service";
import { ItemService } from "src/item/item.service";
import { getItemCategory, getItemExterior } from "src/utils";
import { TypeService } from "src/item-types/type.service";
import { CategoryService } from "src/category/category.service";
import { CreateProductDto } from "./ProductCreationDto";

@Injectable()
export class ProductsService{
    private logger: Logger = new Logger(ProductsService.name)
    constructor(@InjectModel(ProductModel) private readonly productModel: typeof ProductModel,
                private readonly botInventoryItem: BotItemInventoryService,
    ){

    }

    async createProduct(createProductDto: CreateProductDto): Promise<{id: number, success: boolean}> {
        const { bot_item_id } = createProductDto;

        try{
            const botItem = await this.botInventoryItem.findOne({id: bot_item_id});
            if (!botItem) {
                throw new NotFoundException(`Bot item with ID ${bot_item_id} not found`);
            }
    
            const existingProduct = await this.productModel.findOne({ where: { bot_item_id } });
            if (existingProduct) {
                throw new ConflictException(`Bot item with ID ${bot_item_id} is already assigned to another product`);
            }
            const new_product: ProductCreationAttr ={
                bot_item_id: bot_item_id,
                price: createProductDto.price,
                listed : createProductDto.list
            }
            const product = await this.productModel.create(new_product);
            return {id: product.id, success: true}
        }catch(error){
            this.logger.error(`Error creating product for bot item #${bot_item_id}:\n ${error.message}\n ${error.stack}`)
            throw error
        }
        
      
    }
    
    async update(fields: Partial<ProductModel>, where_clause: Partial<ProductModel>, transaction?:Transaction){
        try {
            return await this.productModel.update(fields, {where:where_clause, transaction})
        } catch (error) {
            throw error
        }
    }


    // async createSticker(sticker: ProductStickerCreationAttr, transaction?:Transaction){
    //     try {
    //         return await this.productStickerModel.create(sticker, {transaction})
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // async createFromBotItem(bot_item_id: number, price: number, list: boolean = false,transaction?: Transaction){
    //     try {
    //         // const [bot_item, item_db, type_db] = await Promise.all([
    //         //     this.botInventoryItem.findOne({id: bot_item_id},transaction),
    //         //     this.itemService.findOne({market_hash_name: bot_item.hash_name}, transaction)
    //         // ])
    //         const bot_item = await this.botInventoryItem.findOne({id: bot_item_id},transaction)
    //         if(!bot_item) throw new HttpException('No such item in bot inventory',HttpStatus.NOT_FOUND)
    //         const item_db = await this.itemService.findOne({market_hash_name: bot_item.hash_name}, transaction)
    //         if(!item_db) throw new HttpException('No such item in our db',HttpStatus.NOT_FOUND)
    //         const type = bot_item.ceeconitem.getTag('Type').name
    //         const type_db = await this.typeService.findOne({name: type})
    //         if(!type_db) throw new HttpException('No such item type in our db',HttpStatus.NOT_FOUND)
    //         const category = getItemCategory(bot_item.ceeconitem)
    //         let category_id = null
    //         if(category){
    //             category_id = await this.categoryService.findOne({name: category})
    //         }
    //         const product: ProductCreationAttr = {
    //             market_hash_name: bot_item.hash_name,
    //             price: price,
    //             listed: list,
    //             bot_item_id: bot_item.id,
    //             item_id: item_db.id,
    //             exterior: getItemExterior(bot_item.ceeconitem),
    //             color: bot_item.ceeconitem.getTag('Rarity').color,
    //             type_id: type_db.id,
    //             rarity: bot_item.ceeconitem.getTag('Rarity').name,
    //             category_id,

    //         }
    //     } catch (error) {
    //         throw error
    //     }
    // }
}