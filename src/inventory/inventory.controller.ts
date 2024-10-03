import { Controller, Get, HttpException, HttpStatus, Inject, Logger, Req, Res, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { AuthenticatedGuard } from "src/auth/guards/custom.guard";
import { Response, Request } from "express";
import { BotExceptionsFilter, CustomExceptionFilter } from "src/exceptions/custom-exceptions.filter";
import { error } from "console";
import { ResponseWrapperInterceptor } from "src/interceptors/custom-response";

@UseGuards(AuthenticatedGuard)
@UseInterceptors(ResponseWrapperInterceptor)
@Controller('inventory')
export default class InventoryController{
    private logger = new Logger(InventoryController.name)
    constructor(private readonly inventoryService: InventoryService){

    }
    @UseFilters(BotExceptionsFilter)
    @Get('/refresh')
    async refreshInventory(@Req() req: Request) {
      try {
         const inventory = await this.inventoryService.refreshInventory(req.user);
         return inventory
      } catch (e) {
        this.logger.error(e)
        throw e
      }
    }
    @UseFilters(CustomExceptionFilter)
    @Get('')
    async getInventory(@Req() req:Request){
        try{
            const inventory = await this.inventoryService.requestInventory(req.user.userId)
            return inventory
        }catch(e){
          this.logger.error(e)
            throw e
        }
    }
}