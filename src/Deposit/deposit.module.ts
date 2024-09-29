import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BotsModule } from "src/Bots/bots.module";
import { InventoryModule } from "src/inventory/inventory.module";
import { DepositModel } from "./deposit.model";
import { DealModule } from "src/Deals/deal.module";
import { DepositService } from "./deposit.service";
import { DepositController } from "./deposit.controller";
import { TradeDepositService } from "./trade-deposit.service";
import { TradeDepositModel } from "./trade-deposit.model";
import { BotInventoryModule } from "src/bot-inventory/bot-inventory.module";
// import { TradeDepositService } from "./trade-deposit.service";

@Module({
    imports:[
        SequelizeModule.forFeature([DepositModel,TradeDepositModel]),
        DealModule,
        BotInventoryModule,
        // forwardRef(()=>BotsModule),
        // forwardRef(()=>InventoryModule)
        InventoryModule,
        BotsModule
    ],
    exports:[DepositService, TradeDepositService],
    controllers:[DepositController],
    providers:[DepositService, TradeDepositService]
})
export class DepositModule{}