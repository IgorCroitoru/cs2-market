import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ItemService } from "./item.service";
import { ItemModel } from "./item.model";

@Module({
    imports: [SequelizeModule.forFeature([ItemModel])],
    providers: [ItemService],
    exports: [ItemService]
})
export class ItemModule {

}