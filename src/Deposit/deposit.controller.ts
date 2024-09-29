import { Body, Controller, Post, Req, Res, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";
import { BotExceptionsFilter } from "src/exceptions/custom-exceptions.filter";
import { AuthenticatedGuard } from "src/auth/guards/custom.guard";
import { ResponseWrapperInterceptor } from "src/interceptors/custom-response";
import { DealService } from "src/Deals/deal.service";
import { DealCreationDto, TradeDepositDto } from "src/Dtos/DealDto";
import { TradeDepositService } from "./trade-deposit.service";

@UseGuards(AuthenticatedGuard)
@UseInterceptors(ResponseWrapperInterceptor)
@Controller('deposit')

export class DepositController{

    constructor(private readonly tradeDepositService:TradeDepositService){

    }
    @UseFilters(BotExceptionsFilter)
    @Post('trade')
    async makeTrade(@Body() tradeDto: TradeDepositDto,@Req() req:Request) {
      // Call the service method to handle the trade logic
      try{
      const deal = await this.tradeDepositService.createTrade(req.user, tradeDto);
      return new DealCreationDto(deal.id)
      }
      catch(e)
      {
        throw e
      }

    }
}