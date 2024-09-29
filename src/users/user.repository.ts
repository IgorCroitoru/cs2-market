// import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/sequelize";
// import { Sequelize } from "sequelize-typescript";
// import { ValidationException } from "src/exceptions/custom-exceptions.filter";
// import { User } from "src/users/users.model";


// @Injectable()
// export class UserRepository{
//     constructor(@InjectModel(User) private readonly userModel:typeof User, readonly sequelize: Sequelize){

//     }
//     /**
//      * 
//      * @param id either a primary key or steamId64
//      */
//     async findOne(id:number | string):Promise<User | null>{
//         try{
//             if(typeof id === "number"){
//                 return await this.userModel.findByPk(id)
//             }
//             else{
//                 return await this.userModel.findOne({where:{steamId64:id}})
//             }
//         }
//         catch(e){
//             return null
//         }
//     }
//     async create(userDetails:Partial<User>):Promise<User>
//     {
//         if (!userDetails.steamId64 || !userDetails.username) {
//             throw new ValidationException('Steam ID and username are required');
//         }

//         return this.userModel.create(userDetails);
//     }
// }