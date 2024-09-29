import { Module } from "@nestjs/common";
import { TypeService } from "./type.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { TypeModel } from "./type.model";


@Module({
    providers:[TypeService],
    exports:[TypeService],
    imports:[SequelizeModule.forFeature([TypeModel])]
})
export class TypeModule{}