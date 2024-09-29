import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TypeCreationAttr, TypeModel } from "./type.model";
import { Transaction } from "sequelize";


@Injectable()
export class TypeService{
    constructor(@InjectModel(TypeModel)private readonly typeModel: typeof TypeModel){}

    async create(type: TypeCreationAttr, transaction? :Transaction){
        try{
            return await this.typeModel.create(type, {transaction})
        }catch(e){
            throw e
        }
    }
    async findOne(where: Partial<TypeModel>, transaction?:Transaction){
        try {
            return await this.typeModel.findOne({where,transaction})
        } catch (error) {
            throw error
        }
    }
}