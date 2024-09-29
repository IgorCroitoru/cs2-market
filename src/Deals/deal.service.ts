import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { OfferErrorModel, TradeDeal, TradeDealCreationAttr, TradeDealType } from "./deal.model";
import { Includeable, Op, QueryTypes, Transaction, WhereOptions } from "sequelize";


@Injectable()
export class DealService {
    private readonly logger = new Logger(DealService.name);

    constructor(@InjectModel(TradeDeal)  private tradeDeal: typeof TradeDeal,
                @InjectModel(OfferErrorModel) private offerErrorModel: typeof OfferErrorModel,
               
){

    }
    
    async findOne(where_clause:Partial<TradeDeal>, include?: Includeable  | Includeable[] ,transaction?: Transaction){
        try{
            return await this.tradeDeal.findOne({where: where_clause,include ,transaction})
            
        }catch(e){
            throw e
        }
    }
    async create(deal: TradeDealCreationAttr, transaction: Transaction){
        return await this.tradeDeal.create(deal,{transaction})
    }
    async update(deal: Partial<TradeDeal>, where_clause: Partial<TradeDeal>, transaction?: Transaction): Promise<boolean>{
        try{
            const [affected] = await this.tradeDeal.update(deal, 
                {where: where_clause , transaction}
            )
            return affected > 0
        }catch(e) {throw e}
    }
    async setError(deal_id:number,error:any, transaction?:Transaction):Promise<OfferErrorModel>{
        try{
            
            const [errorOffer, [updatedLines]] =await Promise.all([
                this.offerErrorModel.create({trade_deal_id: deal_id, error}, {transaction}),
                this.tradeDeal.update(
                    {status: "failed"},
                    {where:{id: deal_id},
                    transaction},)
            ])
            if(updatedLines<1) {
                return null
            }
            return errorOffer
        }catch(e){
            throw e
        }
    }

    async getUserActiveDeals(userId: number,type:TradeDealType): Promise<number>{
        try{
            const trades = await this.tradeDeal.count({
                where: {
                    userId,
                    type: type,
                    status: {
                    [Op.in]: ['needsConf' , 'pending' , 'assigned' , 'active']
                  }
                }
              });
              return trades
        }catch(e){
            throw e
        }
    }

    async checkDepositItemsAlreadyInADeal(userId: number, assetIds: string[]){
        try{
            const [result] = await this.tradeDeal.sequelize.query<{exists:boolean}>(`
                SELECT EXISTS (
                    SELECT 1
                    FROM trade_deals
                    JOIN deal_deposit_details as td ON td.trade_deal_id = trade_deals.id
                    WHERE type = 'deposit'
                    AND "userId" = :userId
                    AND status IN ('needsConf', 'pending', 'assigned', 'active')
                    AND (
                        td."assetId" = ANY (ARRAY[:assetIds])
                    )
                ) AS "exists";
                `,
                {
                    replacements: { userId, assetIds },
                    type: QueryTypes.SELECT,
                }
            )
            return result.exists
        }catch(e){
            throw e
        }
    }

    // async createTrade(user:User,items:TradeDto):Promise<TradeDeal>{
    //     const transaction = await this.sequelize.transaction()
    //     try{
    //         if(!user.tradeOfferUrl) throw new HttpException('Set trade url first', HttpStatus.BAD_REQUEST)
    //         if(await this.checkDepositItemsAlreadyInADeal(user.userId, items.items)){
    //             throw new HttpException("Items already in an active trade", HttpStatus.BAD_REQUEST)
    //         }
    //         if(await this.getUserActiveDeals(user.userId,'deposit') >= 5){
    //             throw new HttpException('You have more than 5 active trades, accept or cancel them to make new one', HttpStatus.BAD_REQUEST)
    //         }
    //         let bot: BotType | undefined;
    //         const botDb = await this.botService.getForTrade(user.userId)
    //         if(botDb.length===0) throw new HttpException('No available bot found.', HttpStatus.INTERNAL_SERVER_ERROR);

    //         //TODO for future to split items to few bots if space isn't enough
    //         for(const b of botDb){
    //             const potentialBot = this.botsManager.getBotById(b.botId64)
    //             if(potentialBot && b.potential_items_count + items.items.length <= 1000){
    //                 bot = potentialBot
    //                 break
    //             } 
    //         }
    //         if (!bot) {
    //             throw new HttpException('No available bot found.', HttpStatus.INTERNAL_SERVER_ERROR);
    //         }
    //         const inventory = await this.inventoryService.findOne({userId:user.userId})
            
    //         if(!checkItemsInInventory(inventory,items.items)) {
    //             throw new HttpException('Your inventory is not up to date, please refresh it', HttpStatus.BAD_REQUEST)
    //         }
    //         const filtered = getMatchingItems(inventory,items.items)
    //         const newDep: DepositCreationAttr = {
    //             userId: user.userId,
    //             status: "pending",
    //             amount: 0,
    //             type:'trade_offer'
    //         }
    //         const deposit = await this.depositService.create(newDep, transaction)
    //         const newTradeDeal:TradeDealCreationAttr = {
    //             depositId: deposit.id,
    //             status: "pending",
    //             userId: user.userId,
    //             type: 'deposit'
                
    //         }
    //         const deal = await this.create(newTradeDeal,transaction)
    //         console.log(deal.id)
    //         const itemsDb:TradeDealItemCreationAttr[] = filtered.map(i => {
    //             return {
    //                 trade_deal_id: deal.id,
    //                 ceeconitem: i,
    //                 assetId: String(i.assetid),
    //                 price: 0,
                   
    //             };
    //         });
    //         await this.tradeDealItemsService.createBulk(itemsDb,transaction)
    //         await transaction.commit()
    //         this.logger.log(`Selected potential bot ${bot.id} for performing trade_deposit #${deal.id} for deposit #${deposit.id}`)
    //         this.logger.log(`Created trade deposit #${deal.id} with user ${user.userId}, ${itemsDb.length} items`)
    //         const dealDto = new DealDto(deal.id,user.tradeOfferUrl,user.steamId64, filtered)
    //         const timeoutId = setTimeout(() => {
    //             //TODO
    //             //IN CASE THAT BOT RECEIVED MESSAGE BUT DIDN'T SEND BACK ACK
    //             throw new Error('No response received from server')
    //           }, 10000);
        
    //         bot.socket.emit(ESocketEvents.NEW_DEAL,dealDto, async (response)=>{
    //             if(response.error!==undefined){
    //                 await this.setError(dealDto.id,response.error)
    //                 this.logger.error(`Error on new deposit response ack: ${response.error}`)
    //             }

    //             clearTimeout(timeoutId)
    //         })
    //         return deal
    //     }catch(error){
    //         await transaction.rollback();
    //         this.logger.error(`Error occurred at trade creation for user with id ${user.userId}: ${error}`)
    //         throw error
    //     }
    // }


    // async handleOfferCreation(payload:OfferCreationPayload,botId:number): Promise<ResponseCallbackData>{
    //     const transaction = await this.sequelize.transaction()
    //     try{
    //         const deal = payload.deal
    //         if(payload.error){
    //             await Promise.all([
    //             this.setError(deal.id,payload.error,transaction),
    //             this.depositService.update({status:'failed'}, {id:payload.deal.id}, transaction)
    //             // this.depositService.changeStatus(payload.deposit.depositId, "failed",transaction)
    //             ])
    //             await transaction.commit()
    //             this.logger.warn(`Deposit ${deal.id} failed with error:  ${JSON.stringify(payload.error)}`)
    //             return {status:'ok'}
    //         }
            
    //         const for_update:Partial<TradeDeal> = {
    //             offerId: payload.deal.offerId,
    //             trade_offer_created_at: payload.trade_offer_created_at,
    //             trade_offer_expiry_at: payload.trade_offer_expiry_at,
    //             status: payload.status,
    //             botId: botId
    //         }
    //         const isUpdated = await this.update(for_update, {id:payload.deal.id},transaction)
    //         this.logger.log(`Deal ${deal.id} update. Created offer #${deal.offerId} by bot [${botId}]`)
    //         await transaction.commit()
    //         if(isUpdated) return {status:'ok'}
    //         else return {status:'error'}
    //     }catch(e){
    //         await transaction.rollback()
    //         this.logger.error(`Error handling offer creation for ${payload.deal.id}: ${e}`)
    //         return {status:'error'}
    //     }
    // }

    // async handleOfferStateChange(payload:OfferChangeStatePayload):Promise<ResponseCallbackData>{
    //     const transaction = await this.sequelize.transaction()
    //     try{
    //         const deal = await this.findOne({offerId:payload.offerId},transaction)
    //         const depositStatus = getDepositStatusByOfferStatus(payload.state)
    //         await Promise.all([
    //             this.depositService.update({status: depositStatus}, {id:deal.depositId},transaction),
    //             //this.tradeRepository.changeStatus(payload,transaction)
    //             this.update({
    //                 status:payload.state,
    //                 trade_offer_finished_at: payload.trade_offer_finished_at 
    //             }, 
    //             {offerId:payload.offerId},transaction)
    //         ])
           
    //         if(payload.state === 'accepted'){
                
    //             //updating new received items with their new assetid in bots inventory
    //             const receivedAssetsPromises = payload.received.map((item) => {
    //                 return this.tradeDealItemsService.update({newAssetId:item.new_assetid.toString()},{trade_deal_id: deal.id})
    //             });
    //             await Promise.all(receivedAssetsPromises)
    //             await this.botService.updateItemsCount(payload.received.length,{botId:deal.botId},transaction)
    //             //removing traded items from user inventory
    //             // const inventory = await this.inventoryRepository.findByUserId(deposit.userId)
    //             const inventory = await this.inventoryService.findOne({userId:deal.userId})
    //             if(inventory.length>0){
    //                 await this.inventoryService.removeItemsByAssetIds(deal.userId,
    //                      payload.received.map(i=>{return i.assetid.toString()}),
    //                      transaction)
    //             }
    //         }
    //         await transaction.commit()
             
    //         this.logger.log(`Changed state to [${payload.state}] for offer #${payload.offerId}`)
    //         return {status:'ok'}
    //     }catch(e){
    //         await transaction.rollback()
    //         this.logger.error(`Error while handling offer change state for offer #${payload.offerId}: ${e}`)
    //         return {status:'error'}
    //     }
    // }
}