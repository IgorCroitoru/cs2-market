import { BotModel } from "src/Bots/bots.model";

export default class BotDto{
    botId: number;
    botId64: string;
    items_count:number;
    ready:boolean;
    username: string
    constructor(botModel:BotModel){
        this.botId = botModel.botId
        this.botId64 = botModel.botId64
        this.items_count = botModel.items_count
        this.ready = botModel.ready
        this.username = botModel.username
    }
}