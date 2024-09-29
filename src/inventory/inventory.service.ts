import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Inventory } from "./inventory.model";
import { ItemInvDto, toItemDto } from "src/Dtos/ItemInvDto";
import { User } from "src/users/users.model";
import BotsManager from "src/Bots/bots-manager";
import { ESocketEvents } from "src/Bots/bot-info-payload";
import { Transaction} from "sequelize";
import { ItemInv, toItemInv } from "src/Entities/ItemInv";
import { CEeconItemRehydration, hydrateItem } from "src/utils";
import e from "express";
import CEconItem from "steamcommunity/classes/CEconItem";


@Injectable()
export class InventoryService{
    constructor(
      @InjectModel(Inventory) private inventoryModel: typeof Inventory,
      private botsManager: BotsManager
    ){
        
    }
    
    async findOne(where_clause: Partial<Inventory>, transaction?:Transaction){
      try{
        return await this.inventoryModel.findOne({where:where_clause, transaction})
      }catch(e){throw e}
    }

    async requestInventory(userId:number) :Promise<ItemInvDto[]>{
      try {
        const inv = await this.findOne({userId})
        return inv.items.map(i => {
          return new ItemInvDto({...i, price: 0, unavailable_reason: null })
        })
      } catch (error) {
        throw error
      }
    }

    async update(toUpdate: Partial<Inventory>,where_clause: Partial<Inventory>,transaction?:Transaction){
      try{
        const [inventory, created] = await this.inventoryModel.upsert(
          { ...toUpdate, ...where_clause }, 
          { transaction }
      );
      }catch(e){
        throw e
      }
    }
    async refreshInventory(user:User): Promise<ItemInvDto[]> {
      try {
        const bot = this.botsManager.selectBot;
        if(!bot) {
          throw new HttpException('No bots available', 500)
        }
        const inventory = await new Promise<ItemInvDto[]>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Timeout'));
          }, 10000); // 10 seconds timeout
  
          bot.socket.emit(ESocketEvents.INVENTORY_FETCH, user.steamId64, async (info, inv) => {
            clearTimeout(timeoutId);
            const inventory = inv.map(item => hydrateItem(item, CEconItem));
            if (info.error) {
              return reject(new Error("Error fetching inventory"));
            }
            try {
              const ceecon_items = inventory.map(CEeconItemRehydration)
              const items_inv = ceecon_items.map(i=>toItemInv(i, user.steamId64))
              await this.update({items:items_inv}, {userId:user.userId});
              resolve(items_inv.map(toItemDto));
            } catch (error) {
              reject(error);
            }
          });
        });
  
        return inventory;
      } catch (e) {
        if (e.message === 'Timeout') {
          throw new HttpException('Timeout', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        throw e;
      }
    }

    async removeItemsByAssetIds(userId: number, assetIdsToRemove: string[], transaction?: Transaction): Promise<void> {
      if (!assetIdsToRemove.length) {
        // No items to remove, exit the method
        return;
      }
    
      try {
        // Safely format asset IDs to be used in the query
        const assetIdsCondition = assetIdsToRemove.map(id => `'${id}'`).join(',');
    
        await this.inventoryModel.update(
          {
            items: this.inventoryModel.sequelize.literal(
              `(
                SELECT COALESCE(jsonb_agg(item), '[]'::jsonb)
                FROM jsonb_array_elements(items) AS item
                WHERE item ->> 'assetid' NOT IN (${assetIdsCondition})
              )`
            ),
          },
          {
            where: {
              userId: userId
            },
            transaction
          },
        );
      } catch (error) {
        throw new Error(`Error updating inventory: ${error.message}`);
      }
    }
    
}

