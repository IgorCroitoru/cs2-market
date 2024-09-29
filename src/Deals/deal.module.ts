import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { OfferErrorModel, TradeDeal } from "./deal.model";
import { DealService } from "./deal.service";
import { TradeDealDetailModel } from "./deal-deposit-items.model";
import { BotsModule } from "src/Bots/bots.module";
import { DepositModule } from "src/Deposit/deposit.module";
import { InventoryModule } from "src/inventory/inventory.module";
import { DealDetailService } from "./deal-items.service";

@Module({
    imports:[
        SequelizeModule.forFeature([TradeDeal, OfferErrorModel, TradeDealDetailModel]),
        ],
    providers: [DealService,DealDetailService],
    exports: [DealService,DealDetailService]
    
})
export class DealModule{
}