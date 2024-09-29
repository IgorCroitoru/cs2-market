import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { CategoryModel } from "./category.model";


@Module({
    providers:[CategoryService],
    exports:[CategoryService],
    imports:[SequelizeModule.forFeature([CategoryModel])]
})
export class CategoryModule{

}