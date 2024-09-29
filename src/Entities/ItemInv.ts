import { getInspectUrl, getNameTag, getStickers } from "src/utils"
import CEconItem from "steamcommunity/classes/CEconItem"
export class ItemInv{
    ceeconitem: CEconItem
    rarity: string
    type: string
    inspect_url?:string
    icon_url:string
    name_tag?:string
    stickers:Sticker[]|null
    color:string
    price?:number
    assetid: string
    market_hash_name: string
    exterior: string | null
    st: boolean
    souvenir: boolean
    constructor(item:CEconItem,owner?: string){
        this.ceeconitem = item
        this.market_hash_name = item.market_hash_name
        this.assetid = item.assetid.toString()
        this.rarity = item.getTag("Rarity").name,
        this.color = item.getTag("Rarity").color
        this.exterior = item.getTag('Exterior') ? item.getTag('Exterior').name : null
        this.type = item.getTag("Type") ? item.getTag("Type").name : null
        this.inspect_url = owner? getInspectUrl(item.actions,owner, Number(item.assetid)): null
        this.st = item.getTag('Quality') ? (item.getTag('Quality').name === 'StatTrak™' ? true: false): false
        this.souvenir = item.getTag('Quality') ? (item.getTag('Quality').name === 'Souvenir' ? true: false): false
        this.name_tag = getNameTag(item.fraudwarnings)
        this.icon_url = item.getImageURL()
        this.stickers = getStickers(item.descriptions)
    }
}

export class Sticker{
    name: string
    icon_url: string
    constructor(name: string, icon_url: string){
        this.name = name
        this.icon_url = icon_url
    }
    
}

export function toItemInv(item:CEconItem, owner? : string){
    return new ItemInv(item, owner)
}
    
