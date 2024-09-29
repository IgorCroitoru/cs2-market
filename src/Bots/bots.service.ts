import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { BotModel, ExtendedBotModel } from "./bots.model";
import BotDto from "src/Dtos/BotDto";
import { QueryTypes, Transaction } from "sequelize";
import { InjectModel } from "@nestjs/sequelize";
import { ESocketEvents } from "./bot-info-payload";
import { ItemInv } from "src/Entities/ItemInv";
import { User } from "src/users/users.model";
import BotsManager from "./bots-manager";

@Injectable()
export class BotService{
    private readonly logger = new Logger(BotService.name);
    constructor(
                @InjectModel(BotModel) private botModel: typeof BotModel,
                private readonly botsManager: BotsManager
    ){}

    async updateItemsCount(nr:number,where_clause:Partial<BotModel>,transaction:Transaction){
        try{
            const [affected] = await this.botModel.update(
                {
                    items_count: this.botModel.sequelize.literal(`items_count + ${nr}`)
                },
                {
                    where: where_clause,
                    transaction
                }
            )
            return affected>0
        }catch(e){
            throw e
        }
    }
    async update(fields: Partial<BotModel>, where_clause: Partial<BotModel>,transaction?:Transaction){
        try{
            const [affected] = await this.botModel.update(fields, {where:where_clause})
            return affected>0
        }catch(e){
            throw e
        }
    }
    async createBot(bot:Partial<BotModel>):Promise<BotDto>{
        try{
            const newBot = await this.botModel.create(bot)
            return new BotDto(newBot)
        }catch(e)
        {
            this.logger.error(e)
            throw e
        }
    }

    async setReady(id: number | string, ready:boolean){
        try{
            const where_clause = typeof id === 'number'? {botId: id} : {botId64: id}
            await this.update({ready},where_clause)
        }
        catch(e){
            throw e
        }
    }

    async findOne(where_clause:Partial<BotModel>): Promise<BotModel>{
        return await this.botModel.findOne({where:where_clause})
    }

    async getForTrade(userId:number):Promise<ExtendedBotModel[]>{
        try{
            const [results] = await this.botModel.sequelize.query<ExtendedBotModel[] | ExtendedBotModel>(`
                SELECT
                    bots.*,COALESCE(t.total_traded_items, 0) + bots.items_count AS potential_items_count
                FROM
                    bots
                LEFT JOIN (
                          SELECT
                              "botId",
                              COUNT(*) AS total_traded_items
                          FROM
                              trade_deals
                          WHERE
                              status IN ('active', 'needsConf', 'pending', 'assigned')
                          GROUP BY
                              "botId"
                      ) AS t ON bots."botId" = t."botId"
                WHERE
                    bots.ready = TRUE
                    AND (
                        SELECT COUNT(*)
                        FROM trade_deals d1
                        WHERE d1."botId" = bots."botId"
                          AND d1.status IN ('active', 'needsConf','pending', 'assigned')
                    ) < 30
                    AND (
                        SELECT COUNT(*)
                        FROM trade_deals d2
                        WHERE d2."botId" = bots."botId"
                          AND d2."userId" = :userId
                          AND d2.status IN ('active', 'needsConf','pending', 'assigned')
                    ) < 5;
              `, {
                type: QueryTypes.SELECT,
                replacements: {userId}
              },
            );
           
          if(!Array.isArray(results)){
            return [{
              ...results,
              potential_items_count: results.potential_items_count
            }] as ExtendedBotModel[]
          }
          const extendedResults = results.map((bot) => ({
              ...bot,
              potential_items_count: Number(bot.potential_items_count),
          }));
  
          return extendedResults as ExtendedBotModel[];
            
        }catch(e){
            throw e
        }
    }

    // async requestInventory(user:User): Promise<ItemInv[]> {
    //     try {
    //       const bot = this.botsManager.selectBot;
    //       if(!bot) {
    //         throw new HttpException('No bots available', 500)
    //       }
    //       const inventory = await new Promise<ItemInv[]>((resolve, reject) => {
    //         const timeoutId = setTimeout(() => {
    //           reject(new Error('Timeout'));
    //         }, 15000); // 10 seconds timeout
    
    //         bot.socket.emit(ESocketEvents.INVENTORY_FETCH, user.steamId64, async (info, inv) => {
    //           clearTimeout(timeoutId);
    
    //           if (info.error) {
    //             return reject(new Error("Error fetching inventory"));
    //           }
    //           try {
    //             // await this.update({items:inventory}, {userId:user.userId});
    //             resolve(inv);
    //           } catch (error) {
    //             reject(error);
    //           }
    //         });
    //       });
    
    //       return inventory;
    //     } catch (e) {
    //       if (e.message === 'Timeout') {
    //         throw new HttpException('Timeout', HttpStatus.INTERNAL_SERVER_ERROR);
    //       }
    //       throw e;
    //     }
    //   }
}