import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TradeDealDetailCreationAttr, TradeDealDetailModel } from "./deal-deposit-items.model";
import { Transaction } from "sequelize";

@Injectable()
export class DealDetailService{
    constructor(@InjectModel(TradeDealDetailModel) private itemModel: typeof TradeDealDetailModel){}

    async update(fields: Partial<TradeDealDetailModel>, where_clause: Partial<TradeDealDetailModel>, transaction?:Transaction):Promise<boolean>{
        try{
            const [affected] = await this.itemModel.update(fields, {where:where_clause, transaction})
            return affected > 0
        }catch(e){

        }
    }

    async createBulk(tradeItems:TradeDealDetailCreationAttr[], transaction?:Transaction){
        try{
            await this.itemModel.bulkCreate(tradeItems,{transaction})
        }catch(e){
            throw e
        }
    }
    async findOne(fields: Partial<TradeDealDetailModel>, transaction?:Transaction){
        return await this.itemModel.findOne({where:fields,transaction})
    }
    async findAll(fields: Partial<TradeDealDetailModel>, transaction?:Transaction){
        return await this.itemModel.findAll({where:fields,transaction})
    }

    async create(item: TradeDealDetailCreationAttr, transaction?:Transaction){
        return await this.itemModel.create(item, {transaction})
    }
}