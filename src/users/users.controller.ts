import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
// import { UsersService } from './users.service';
import { SteamOauthGuard } from 'src/auth/guards/steam-oauth.guard';
import { AuthenticatedGuard } from 'src/auth/guards/custom.guard';
import { Request,Response } from 'express';
@Controller('users')
export class UsersController {

    constructor(){

    }
    
    @Get('/')
    @UseGuards(AuthenticatedGuard)
    async getUsers( @Req() req: Request, @Res() res: Response){
        res.json({'session':req.session})
    }
}
