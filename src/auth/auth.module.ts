import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/users.model";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { SteamStrategy } from "./strategies/steam.strategy";
import { AuthController } from "./auth.controller";
import { SessionSerializer } from "./serializer";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'steam' , session:true}),
       UsersModule, 
      ],
    providers:[AuthService,SteamStrategy, SessionSerializer],
    controllers: [AuthController],
    exports: [AuthService],

})
export class AuthModule{}