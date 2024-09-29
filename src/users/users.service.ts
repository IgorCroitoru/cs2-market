import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize'; // Ensure you have @nestjs/sequelize installed
import { User } from './users.model'; // Adjust the import path as necessary
import { ValidationException } from 'src/exceptions/custom-exceptions.filter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  // async getUser(steamId64: string): Promise<User> {
  //   const user = await this.userModel.findOne({
  //     where: { steamId64 },
  //   });

  //   if (!user) {
  //     throw new NotFoundException(`User with steamId64 ${steamId64} not found`);
  //   }

  //   return user;
  // }
  async create(userDetails:Partial<User>):Promise<User>
    {
        if (!userDetails.steamId64 || !userDetails.username) {
            throw new ValidationException('Steam ID and username are required');
        }

        return this.userModel.create(userDetails);
    }
  async findOne(id:number | string):Promise<User | null>{
    try{
        if(typeof id === "number"){
            return await this.userModel.findByPk(id)
        }
        else{
            return await this.userModel.findOne({where:{steamId64:id}})
        }
    }
    catch(e){
        return null
    }
}
}