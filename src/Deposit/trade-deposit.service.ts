import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DepositService } from "./deposit.service";
import { User } from "src/users/users.model";
import { Sequelize } from "sequelize-typescript";
import { DealService } from "src/Deals/deal.service";
import BotsManager, { BotType } from "src/Bots/bots-manager";
import { ESocketEvents, ExtendedMEconItemExchange, OfferChangeStatePayload, OfferCreationPayload, ResponseCallbackData } from "src/Bots/bot-info-payload";
import { checkItemsInInventory, getDepositStatusByOfferStatus, getMatchingItems, getTradeDepositStatusByOfferStatus, hydrateExtendedMEconItem, hydrateMEconItem } from "src/utils";
import { BotService } from "src/Bots/bots.service";
import { Inventory } from "src/inventory/inventory.model";
import { InventoryService } from "src/inventory/inventory.service";
import { DepositCreationAttr, DepositModel } from "./deposit.model";
import { TradeDeal, TradeDealCreationAttr } from "src/Deals/deal.model";
import { DealDetailService } from "src/Deals/deal-items.service";
import DealDto, { TradeDepositDto } from "src/Dtos/DealDto";
import { BotEventEmitter } from "src/Bots/bot-event-emitter";
import { TradeDealDetailCreationAttr } from "src/Deals/deal-deposit-items.model";
import { TradeDepositCreationAttr, TradeDepositModel } from "./trade-deposit.model";
import { Includeable, Transaction } from "sequelize";
import { InjectModel } from "@nestjs/sequelize";
import { BotItemCreationAttr } from "src/bot-inventory/bot-inventory.model";
import { BotItemInventoryService } from "src/bot-inventory/bot-inventory.service";
import CEconItem from "steamcommunity/classes/CEconItem";

@Injectable()
export class TradeDepositService implements OnModuleInit{
    private readonly logger = new Logger(TradeDepositService.name);
    constructor(@InjectModel(TradeDepositModel) private readonly tradeDepositModel: typeof TradeDepositModel,
                private readonly depositService: DepositService,
                private readonly dealService: DealService,
                private readonly sequelize: Sequelize,
                private readonly botsManager: BotsManager,
                private readonly botService: BotService,
                private readonly inventoryService: InventoryService,
                private readonly tradeDealDetailService: DealDetailService,
                private readonly botEventEmitter: BotEventEmitter,
                private readonly botItemService: BotItemInventoryService
    ){}

    onModuleInit() {
        this.subscribeToBotEvents();
      }
    subscribeToBotEvents(){
        this.botEventEmitter.onOfferStateChange((data) => {
            this.handleOfferStateChange(data);
          });
        this.botEventEmitter.onOfferCreation((data)=> {
            this.handleOfferCreation(data, data.botId)
        })
    }
    async create(instance: TradeDepositCreationAttr, transaction?:Transaction){
        try{
            return await this.tradeDepositModel.create(instance, {transaction})
        }catch(e){
            throw e
        }
    }

    async update(fields: Partial<TradeDepositModel>, where_clause: Partial<TradeDepositModel>, transaction?:Transaction){
        try{
            return await this.tradeDepositModel.update(fields, {where: where_clause,transaction})
        }catch(e){throw e}
    }

    async findAll(where_clause: Partial<TradeDepositModel>,include: Includeable | Includeable [],transaction?:Transaction){
        try{
            return await this.tradeDepositModel.findAll({where:where_clause, include: include, transaction})
        }catch(e){
            throw e
        }
    }
    async createTrade(user:User,items:TradeDepositDto):Promise<DepositModel>{
        const transaction = await this.sequelize.transaction()
        try{
            if(!user.tradeOfferUrl) throw new HttpException('Set trade url first', HttpStatus.BAD_REQUEST)
            if(await this.dealService.checkDepositItemsAlreadyInADeal(user.userId, items.items)){
                throw new HttpException("Items already in an active trade", HttpStatus.BAD_REQUEST)
            }
            if(await this.dealService.getUserActiveDeals(user.userId,'deposit') >= 5){
                throw new HttpException('You have more than 5 active trades, accept or cancel them to make new one', HttpStatus.BAD_REQUEST)
            }
            let bot: BotType | undefined;
            const botDb = await this.botService.getForTrade(user.userId)
            if(botDb.length===0) throw new HttpException('No available bot found.', HttpStatus.INTERNAL_SERVER_ERROR);

            //TODO for future to split items to few bots if space isn't enough
            for(const b of botDb){
                const potentialBot = this.botsManager.getBotById(b.botId64)
                if(potentialBot && b.potential_items_count + items.items.length <= 1000){
                    bot = potentialBot
                    break
                } 
            }
            if (!bot) {
                throw new HttpException('No available bot found.', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const inventory = await this.inventoryService.findOne({userId:user.userId})
            
            
            if(!checkItemsInInventory(inventory.items,items.items)) {
                throw new HttpException('Your inventory is not up to date, please refresh it', HttpStatus.BAD_REQUEST)
            }
            const filtered = getMatchingItems(inventory.items,items.items)
            const newDep: DepositCreationAttr = {
                userId: user.userId,
                status: "pending",
                amount: 0,
                type:'trade_offer'
            }
            const deposit = await this.depositService.create(newDep, transaction)
            const newTradeDeal:TradeDealCreationAttr = {
                depositId: deposit.id,
                status: "pending",
                userId: user.userId,
                type: 'deposit'
                
            }
           
            const deal = await this.dealService.create(newTradeDeal,transaction)
            const tradeDep = await this.create({
                deposit_id: deposit.id,
                amount: 0,
                trade_deal_id: deal.id

            },transaction)
          
            const itemsDb:TradeDealDetailCreationAttr[] = filtered.map(i => {
                return {
                    trade_deal_id: deal.id,
                    ceeconitem: i,
                    assetId: String(i.assetid),
                    price: 0,
                   
                };
            });
            await this.tradeDealDetailService.createBulk(itemsDb,transaction)
            await transaction.commit()
            this.logger.log(`Selected potential bot ${bot.id} for performing trade_deposit #${deal.id} for deposit #${deposit.id}`)
            this.logger.log(`Created trade deal #${deal.id} with user ${user.userId}, ${itemsDb.length} items`)
            const dealDto = new DealDto(deal.id,user.tradeOfferUrl,user.steamId64, filtered)
            const timeoutId = setTimeout(() => {
                // Timeout handling in case bot doesn't send ACK
                throw new Error('No response received from server');
            }, 5000);
            
            bot.socket.emit(ESocketEvents.NEW_DEAL, dealDto, async (response) => {
                clearTimeout(timeoutId);
            
                if (response.error) {
                    const errTrans = await this.sequelize.transaction();
                    try {
                        // Handle bot error and update related entities in the transaction
                        await Promise.all([
                            this.dealService.setError(dealDto.id, response.error, errTrans),
                            this.markDepositAsFailed({id:tradeDep.id}, errTrans)
                        ])
                       
                        await errTrans.commit(); 
                        this.logger.error(`Error on new deposit response ack: ${response.error}`);
                    } catch (err) {
                        // Rollback the error transaction in case of failure
                        await errTrans.rollback();
                        this.logger.error(`Error while handling bot response failure: ${err.message}`);
                    }
                }
            });
            
            return deposit;
        }catch(error){
            await transaction.rollback();
            this.logger.error(`Error occurred at trade creation for user with id ${user.userId}: ${error}`)
            throw error
        }
    }

    async markDepositAsFailed(trade_deposit_where_clause: Partial<TradeDepositModel>,tr?:Transaction){
        const transaction = tr ?? await this.sequelize.transaction()
        try{
           await this.update({
            status:'failed'
           },
           {
            ...trade_deposit_where_clause
           }, transaction)

            // in case that user deposit is splitted in more deals(offers)
            // for example user deposit is processed by 2 bots and if one offer is cancelled then to keep alive the second one
            // and complete the deposit partially 
           const allTradeDep = await this.findAll({...trade_deposit_where_clause}, undefined, transaction)
           const allFailed = allTradeDep.every(td => td.status = 'failed')
           if(allFailed){
            await this.depositService.update({status:'failed'},{id: allTradeDep[0].deposit_id},transaction)
           }
           else{
            await this.depositService.update({status:'partial'},{id: allTradeDep[0].deposit_id},transaction)
           }
           tr ?? await transaction.commit();
        }catch(e){
            tr ?? await transaction.rollback()
            throw e
        }
    }

    async handleOfferCreation(payload:OfferCreationPayload,botId:number){
        const transaction = await this.sequelize.transaction()
        try{
            const deal = payload.deal
            if(payload.error){
                await Promise.all([
                this.dealService.setError(deal.id,payload.error,transaction),
                this.markDepositAsFailed({trade_deal_id: deal.id},transaction)
                ])
                await transaction.commit()
                this.logger.warn(`Deal ${deal.id} failed with error:  ${JSON.stringify(payload.error)}`)
                return
            }
            
            const for_update:Partial<TradeDeal> = {
                offerId: payload.deal.offerId,
                trade_offer_created_at: payload.trade_offer_created_at,
                trade_offer_expiry_at: payload.trade_offer_expiry_at,
                status: payload.status,
                botId: botId
            }
            
            await Promise.all([
                this.update({status:"pending"},{trade_deal_id: deal.id},transaction),
                this.dealService.update(for_update, {id:payload.deal.id},transaction)
            ])
           
            this.logger.log(`Deal ${deal.id} update. Created offer #${deal.offerId} by bot [${botId}]`)
            await transaction.commit()
        }catch(e){
            await transaction.rollback()
            this.logger.error(`Error handling offer creation for ${payload.deal.id}: ${e}`)
        }
    }

   

    async handleOfferStateChange(payload: OfferChangeStatePayload) {
        const transaction = await this.sequelize.transaction();
        try {
            const sentItems = payload.sent?.map(item => hydrateMEconItem(item));
            const receivedItems = payload.received?.map(item => hydrateExtendedMEconItem(item));

            const deal = await this.dealService.findOne(
                { offerId: payload.offerId }, 
                [{ model: TradeDepositModel }], 
                transaction
            );
            
            const depositStatus = getDepositStatusByOfferStatus(payload.state);
            const tradeDepositStatus = getTradeDepositStatusByOfferStatus(payload.state);
            
            // Use Promise.all for parallel operations
            await Promise.all([
                this.depositService.update(
                    { status: depositStatus }, 
                    { id: deal.trade_deposit.id }, 
                    transaction
                ),
                this.update(
                    { status: tradeDepositStatus }, 
                    { id: deal.trade_deposit.id }
                ),
                this.dealService.update(
                    { 
                        status: payload.state, 
                        trade_offer_finished_at: payload.trade_offer_finished_at 
                    }, 
                    { offerId: payload.offerId }, 
                    transaction
                )
            ]);
            
            if (payload.state === 'accepted') {
                // Bulk update new asset IDs in bot inventory
                
                if(payload.received?.length>0){
                    await this.handleReceivedItems(receivedItems, deal, transaction);
                    const assetIds = receivedItems.map(i => i.assetid.toString());
                // Remove traded items from user inventory
                await this.inventoryService.removeItemsByAssetIds(deal.userId, assetIds, transaction);
                }
                if (payload.received && payload.received.length > 0) {
                    const createItemPromises = receivedItems.map(item => 
                        this.botItemService.createFromMEconItem(item, deal.botId)
                    );
                    await Promise.all(createItemPromises);
                }
               
            }
            
            await transaction.commit();
            this.logger.log(`Changed state to [${payload.state}] for offer #${payload.offerId}`);
        } catch (e) {
            await transaction.rollback();
            this.logger.error(`Error while handling offer change state for offer #${payload.offerId}: ${e}`);
        }
    }
    
    // Helper method to handle received items
    private async handleReceivedItems(receivedItems: ExtendedMEconItemExchange[], deal: TradeDeal, transaction: Transaction) {
        const receivedAssetsPromises = receivedItems.map(item => 
            this.tradeDealDetailService.update(
                { newAssetId: item.new_assetid.toString() }, 
                { trade_deal_id: deal.id },
                transaction
            )
        );
        await Promise.all(receivedAssetsPromises);
    
        await this.botService.updateItemsCount(
            receivedItems.length, 
            { botId: deal.botId }, 
            transaction
        );
    
       
    }
    
    
    
    
    
}
function hydrateArray(arg0: any, MEconItemExchange: any) {
    throw new Error("Function not implemented.");
}

