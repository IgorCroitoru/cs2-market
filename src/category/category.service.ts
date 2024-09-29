import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CategoryCreationAttr, CategoryModel } from "./category.model";
import { Transaction } from "sequelize";

@Injectable()
export class CategoryService {
    constructor(@InjectModel(CategoryModel) private readonly categoryModel: typeof CategoryModel){}

    async create(category:CategoryCreationAttr, transaction?:Transaction){
        try{
            return await this.categoryModel.create(category, {transaction})
        }catch(e){
            throw e
        }
    }

    async upsert(category:CategoryCreationAttr, transaction?:Transaction){
        try{
            return await this.categoryModel.upsert(category, {transaction})
        }catch(e){
            throw e
        }
    }

    async findOne(where: Partial<CategoryModel>, transaction?: Transaction){
        try{
            return await this.categoryModel.findOne({where})
        }catch(e){throw e}
    }
    
}