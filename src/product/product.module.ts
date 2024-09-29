import { Module } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { Sequelize } from "sequelize";
import { SequelizeModule } from "@nestjs/sequelize";
import { ProductModel } from "./product.model";
import { TypeModule } from "src/item-types/type.module";
import { CategoryModule } from "src/category/category.module";
import { ItemModule } from "src/item/item.module";
import { BotInventoryModule } from "src/bot-inventory/bot-inventory.module";
import { ProductController } from "./product.controller";

@Module({
    providers:[ProductsService],
    imports: [SequelizeModule.forFeature([ProductModel]), BotInventoryModule],
    controllers: [ProductController],
    exports: [ProductsService]
})
export class ProductModule{}