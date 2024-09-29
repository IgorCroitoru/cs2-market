import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
 constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    // we use a hardcoded string to validate the user for sake of simplicity
    return request.isAuthenticated()
    }
}