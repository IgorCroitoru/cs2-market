import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BotItemInventoryModel } from "./bot-inventory.model";
import { BotItemInventoryService } from "./bot-inventory.service";
import { TypeModule } from "src/item-types/type.module";
import { CategoryModule } from "src/category/category.module";
import { ItemModule } from "src/item/item.module";

@Module({
    imports:[
        SequelizeModule.forFeature([BotItemInventoryModel]),
        TypeModule,
        CategoryModule,
        ItemModule
    ],
    providers: [BotItemInventoryService],
    exports: [BotItemInventoryService]
})
export class BotInventoryModule {}