import { forwardRef, Module } from "@nestjs/common";
import BotsManager from "./bots-manager";
import { BotsGateway } from "./socket/Bots.gateway";
import { TypedSocket } from "./socket/typed-socket";
import { BotModel } from "./bots.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { BotService } from "./bots.service";
import { BotController } from "./bot.controller";
import { BotEventEmitter } from "./bot-event-emitter";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Module({
    imports: [
        SequelizeModule.forFeature([BotModel]),
        // forwardRef(()=>DepositModule)
    ],
    exports: [BotsManager,BotService, BotEventEmitter],
    providers:[
        {
            provide: EventEmitter2,
            useValue: new EventEmitter2(),
        },
        BotsManager,
        BotsGateway,
        TypedSocket,
        BotService,
        BotEventEmitter
             ] ,
    controllers: [BotController]
    
})
export class BotsModule {}