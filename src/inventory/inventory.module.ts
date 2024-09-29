import { forwardRef, Module } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import InventoryController from "./inventory.controller";
import { Inventory } from "./inventory.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { BotModel } from "src/Bots/bots.model";
import { BotsModule } from "src/Bots/bots.module";


@Module({
    
    imports:[
        SequelizeModule.forFeature([Inventory]),
        // forwardRef(()=>BotsModule)
        BotsModule
    ],
    providers:[InventoryService],
    controllers: [InventoryController],
    exports:[InventoryService]
})
export class InventoryModule{}