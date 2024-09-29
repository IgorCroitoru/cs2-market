import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DepositCreationAttr, DepositModel, DepositStatusType } from "./deposit.model";
import { Includeable, Transaction, where } from "sequelize";

@Injectable()
export class DepositService {
    private readonly logger = new Logger(DepositService.name);
    constructor(@InjectModel(DepositModel) private depositModel : typeof DepositModel){}

    async create(deposit: DepositCreationAttr, transaction?:Transaction){
        return await this.depositModel.create(deposit,{transaction})
    }
    async update(fields: Partial<DepositModel>, where_clause: Partial<DepositModel>, transaction?:Transaction){
        try{
            const [affected] = await this.depositModel.update(fields, {where:where_clause,transaction})
            return affected>0
        }catch(e){
            throw e
        }
    }
    async changeStatus(depositId: number, newStatus: DepositStatusType, transaction?: Transaction) {
        const [affected ]=  await this.depositModel.update(
            { status: newStatus },
            {
                where: { id: depositId },  // Ensure the `where` clause matches the full model attributes
                transaction
            }
        );
        return affected>0;
    }
    async findAll(where_clause: Partial<DepositModel>,include: Includeable | Includeable [],transaction?:Transaction){
        try{
            return await this.depositModel.findAll({where:where_clause, include: include, transaction})
        }catch(e){
            throw e
        }
    }
   
}