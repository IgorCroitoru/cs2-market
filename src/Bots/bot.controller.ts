import { Body, Controller, Post, UseFilters, UseInterceptors } from "@nestjs/common";
import { BotService } from "./bots.service";
import { BotModel } from "./bots.model";
import { CustomExceptionFilter } from "src/exceptions/custom-exceptions.filter";
import { ResponseWrapperInterceptor } from "src/interceptors/custom-response";

@UseInterceptors(ResponseWrapperInterceptor)
@Controller('bots')
@UseFilters(CustomExceptionFilter)
export class BotController{
    constructor(private readonly botService:BotService){}

    @Post('create')
    async createBot(@Body() bot:Partial<BotModel>){
        const newBot = await this.botService.createBot(bot)
        return newBot
    }
}