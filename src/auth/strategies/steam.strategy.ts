import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectModel } from "@nestjs/sequelize";
import {Strategy} from 'passport-steam'
import { User } from "src/users/users.model";
import { AuthService } from "../auth.service";
@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy,'steam'){
    constructor(@Inject() private authService: AuthService){
        super({
            returnURL: 'http://localhost:3000/auth/steam/return',
            realm: 'http://localhost:3000/',
            apiKey: process.env.USER_1_API_KEY,
        })
    }
    async validate(identifier: string, profile: any, done: Function) {
        const user = await this.authService.validateUser(profile);
        done(null, user);
      }
}