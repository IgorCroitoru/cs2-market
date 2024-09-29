import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TypedSocket } from "./socket/typed-socket";
import { User } from "src/users/users.model";
import { ItemInvDto, toItemDto } from "src/Dtos/ItemInvDto";
import { ESocketEvents } from "./bot-info-payload";
import { ItemInv } from "src/Entities/ItemInv";
export type BotType =  {
    id?:number,
    socket: TypedSocket
    steamId64: string,
    ready: boolean,
    lastUsed: Date | null
}
//USED ONLY FOR BOTS FOR FETCHING AN INVENTORY
@Injectable()
export default class BotsManager {
    private static instance: BotsManager; // Static instance variable
    private botRegistry: Map<string,BotType> = new Map<string, BotType>()
   

    static get getInstance(): BotsManager {
        if (!BotsManager.instance) {
            // Create a new instance if it doesn't exist
            BotsManager.instance = new BotsManager();
        }
        return BotsManager.instance;
    }

    getBot(socketId:string):BotType|undefined{
        return this.botRegistry.get(socketId)
    }
    getBotById(steamId64:string):BotType | undefined{
        for(let bot of this.botRegistry.values()){
            if(bot.steamId64 === steamId64) return bot

        }
        return undefined
    }
    deleteBot(id:string):boolean{
        return this.botRegistry.delete(id)
    }
    get selectBot(): BotType | null {
        const availableBots = Array.from(this.botRegistry.values()).filter(bot => bot.ready);
        if (availableBots.length === 0) {
            return null; // No available bots
        }
        availableBots.sort((a, b) => {
            if (a.lastUsed && b.lastUsed) {
                return a.lastUsed.getTime() - b.lastUsed.getTime();
            }
            if (!a.lastUsed) return -1;
            if (!b.lastUsed) return 1;

            return 0;
        });
        return availableBots[0];
       
    }

    setBot(id: string, bot: BotType): void {
        if (!this.botRegistry.has(id)) {
            this.botRegistry.set(id, bot);
        }
    }

    
}