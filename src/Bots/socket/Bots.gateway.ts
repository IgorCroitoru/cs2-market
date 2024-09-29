import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Injectable, Logger } from '@nestjs/common';
import BotsManager, { BotType } from '../bots-manager';
import { TypedSocket } from './typed-socket';
import { ESocketEvents, OfferChangeStatePayload, OfferCreationPayload, OnlyProperties, ResponseCallback, ResponseCallbackData, SocketEvents, StatusType } from '../bot-info-payload';
import { BotService } from '../bots.service';
import { TradeDepositService } from 'src/Deposit/trade-deposit.service';
import { BotEventEmitter } from '../bot-event-emitter';
import { MEconItemExchange } from 'steam-tradeoffer-manager';
import CEconItem from 'steamcommunity/classes/CEconItem';

@WebSocketGateway({
    cors:{
        origin: '*'
    }
})
@Injectable()
export class BotsGateway{

    @WebSocketServer()
    private server:Server
    private readonly logger = new Logger(BotsGateway.name);
    constructor(private readonly botsManager:BotsManager,
                private readonly botService: BotService,
                private readonly botEventEmitter: BotEventEmitter
                // private readonly tradeDepositService: TradeDepositService
            ){
        
    }
    async handleConnection(socket:Socket){
        const botId = socket.handshake.query.id64 as string;
        const username = socket.handshake.query.username as string
        const typedSocket = new TypedSocket(socket)
        const bot:BotType = {
            socket:typedSocket,
            steamId64:socket.handshake.query.id64 as string,
            ready: socket.handshake.query.ready as any as boolean,
            lastUsed:null
        }
        const botDb = await this.botService.findOne({botId64:bot.steamId64})
        bot.id = botDb.botId
        if(botDb){
            this.logger.log(`Bot connected: [${username}]: ${botId}`);
            this.botService.setReady(bot.steamId64, bot.ready)
            this.logger.log(`Bot with ID ${botDb.botId} is now ${bot.ready ? 'ready' : 'not ready'}`);
            this.botsManager.setBot(socket.id, bot)
           
        }
       else{
        this.logger.error(`Unknown bot connected: [${username}]: ${botId}`);
       }

        socket.on('disconnect', async ()=>{
            this.botsManager.deleteBot(socket.id)
            this.botService.setReady(bot.id,false)
            this.logger.log(`Bot disconnected: ${botId}`);
        })
    }

    @SubscribeMessage(ESocketEvents.OFFER_CREATION)
    async handleOfferCreation(
        @MessageBody() payload: OfferCreationPayload,
        @ConnectedSocket() socket: Socket,
        ):Promise<ResponseCallbackData>{

            const bot = this.botsManager.getBot(socket.id)
            this.botEventEmitter.emitOfferCreation(bot.id, payload)
            return {status: 'ok'}
            //  return await this.tradeDepositService.handleOfferCreation(payload,bot.id)
    }
    @SubscribeMessage(ESocketEvents.OFFER_CHANGED_STATE)
    async handleOfferState(
        @MessageBody()data: OfferChangeStatePayload,
        @ConnectedSocket()socket:Socket,
       
    ):Promise<ResponseCallbackData>{
        
        const bot = this.botsManager.getBot(socket.id)
        this.botEventEmitter.emitOfferStateChange(bot.id, data)
        return {status: 'ok'}
        // return await this.tradeDepositService.handleOfferStateChange(data)
    }
    @SubscribeMessage(ESocketEvents.READY)
    async handleReadyEvent(
        @MessageBody() ready: boolean,
        @ConnectedSocket() socket: Socket
    ):Promise<void>{
        const bot = this.botsManager.getBot(socket.id)
        if(bot) {
            bot.ready = ready
            await this.botService.setReady(bot.id,ready)
            this.logger.log(`Bot with ID ${bot.id} is now ${ready ? 'ready' : 'not ready'}`);

        }
        

    }
    
}

function hydrateItem(item: OnlyProperties<MEconItemExchange>, CEconItem: any): any {
    throw new Error('Function not implemented.');
}
