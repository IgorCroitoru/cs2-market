import { ItemInv, Sticker } from "src/Entities/ItemInv";
import { getInspectUrl, getNameTag, getStickers } from "src/utils";
import CEconItem from "steamcommunity/classes/CEconItem";


export class ItemInvDto{
    rarity: string
    type: string
    inspect_url?:string
    icon_url:string
    name_tag?:string
    stickers:Sticker[] | null
    color:string
    price:number | null
    assetid: string
    market_hash_name: string
    exterior: string | null
    st: boolean
    souvenir: boolean
    unavailable_reason: string | null
    constructor(item:ItemInv & {price: number, unavailable_reason: string | null}){
        this.market_hash_name = item.market_hash_name
        this.assetid = item.assetid
        this.rarity = item.rarity
        this.color = item.color
        this.exterior = item.exterior
        this.type = item.type
        this.inspect_url = item.inspect_url
        this.st = item.st
        this.souvenir = item.souvenir
        this.name_tag = item.name_tag
        this.icon_url = item.icon_url
        this.stickers = item.stickers
        this.price = item.price
        this.unavailable_reason = item.unavailable_reason
        
    }
        
    
}

//mapper
export function toItemDto(item:ItemInv & {price: number | null, unavailable_reason: string | null}): ItemInvDto{
    return new ItemInvDto(item)
}