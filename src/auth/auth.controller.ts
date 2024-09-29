import { Controller, UseGuards,Get, Req, Res, HttpException, HttpStatus, } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Request, Response } from "express";
import { SteamOauthGuard } from "./guards/steam-oauth.guard";
import { AuthenticatedGuard } from "./guards/custom.guard";

@Controller("auth")
export class AuthController{
    @Get('steam')
    @UseGuards(SteamOauthGuard)
    async steamAuth(@Req()req:Request){
    }
    @Get('steam/return')
    @UseGuards(SteamOauthGuard)
    steamAuthRedirect(@Req()req: Request, @Res() res:Response){
        
        res.redirect('/')
    }
    @Get('logout')
    @UseGuards(AuthenticatedGuard)
    logout(@Req() req: Request, @Res() res: Response) {
        req.logout((err) => {
          if (err) {
            return res.status(500).send('Failed to logout');
          }
          req.session.destroy((err) => {
            if (err) {
              return res.status(500).send('Failed to destroy session');
            }
            res.clearCookie('connect.sid'); // Adjust the cookie name if needed
            return res.redirect('/'); // Redirect to a desired route after logout
          });
        });
      }
}