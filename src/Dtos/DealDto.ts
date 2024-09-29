import CEconItem from "steamcommunity/classes/CEconItem"
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';
import { IsArrayOfAssetIds } from "src/utils/validators";
export default class DealDto{
    public id:number
    public tradeUrl: string
    public userId64: string
    public items_to_give?: CEconItem[]
    public items_to_receive?: CEconItem[]
    constructor(id:number, tradeUrl:string, userID64: string, items_to_receive:CEconItem[], items_to_give?:CEconItem[]){
        this.id = id
        this.tradeUrl = tradeUrl
        this.userId64 = userID64
        this.items_to_receive = items_to_receive
        this.items_to_give = items_to_give
    }
}

export class DealCreationDto{
    public id:number
    constructor(id:number){
        this.id = id
    }
}
export class TradeDepositDto {
    @ArrayNotEmpty()
    @IsArrayOfAssetIds({ message: 'Items must be an array of strings or numbers' })
    items: string[];
  }