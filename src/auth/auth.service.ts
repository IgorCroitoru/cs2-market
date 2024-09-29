import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/users/users.model";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService{
    constructor(
        @Inject()
        private readonly userService:UsersService,
    ){

    }

    async validateUser(profile:any):Promise<User|null>{
        console.log('service validate')
        const steamId64 = String(profile.id);
        let user = await this.userService.findOne(steamId64);
        if(!user){
            user = await this.userService.create({
                steamId64,
                username: profile.displayName,
                avatar: profile.photos[2].value
            })
        }
        return user
    }
}