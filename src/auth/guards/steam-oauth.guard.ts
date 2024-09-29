import {ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs';

@Injectable()
export class SteamOauthGuard extends AuthGuard('steam'){
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
      }
    
    //   handleRequest(err: any, user: any, info: any): any {
    //     if (err || !user) {
    //       throw err || new UnauthorizedException();
    //     }
    //     return user;
    //   }
}
