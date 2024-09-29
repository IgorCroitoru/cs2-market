import DealDto from "src/Dtos/DealDto";
import { ItemInv } from "src/Entities/ItemInv";
import { MEconItemExchange } from "steam-tradeoffer-manager";
import CEconItem from "steamcommunity/classes/CEconItem";


type ClassProperties<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

//helper type for extracting only proprieties without methods
export type OnlyProperties<T> = Pick<T, ClassProperties<T>>;

export type DealCreationStatus = "active" | "pending" | undefined
export type StatusType = 'needsConf'| 'pending' | 'assigned' | 'active' | 'accepted' | 'cancelled' | 'declined' | 'failed';

export default interface IDealCreation{
    id: number
    offerId?: string
    status: DealCreationStatus
    //error: Error | null
}

export type NewDealPayload =  DealDto| DealDto[];


export interface ResponseCallback {
    (response?: ResponseCallbackData): void;
}

// Define callback data type
export interface ResponseCallbackData {
    status: 'ok' | 'error';
    error?: any
}
export interface ResponseCallbackInventory {
    (info: ResponseCallbackData, inventory: OnlyProperties<CEconItem>[]): void;
}
export enum ESocketEvents {
    NEW_DEAL = 'newDeal',
    OFFER_CREATION = 'offerCreation',
    OFFER_CHANGED_STATE = 'offerChangedState',
    INVENTORY_FETCH = 'inventoryFetch',
    READY = 'ready',
  }
  export interface DealCreationPayload {
    deal: DealDto,
    callback?: ResponseCallback
  }
  export type OfferChangeStatePayload = {
    state: StatusType,
    trade_offer_finished_at: number | null
    offerId: string,
    sent?: OnlyProperties<MEconItemExchange>[]
    received ?: OnlyProperties<ExtendedMEconItemExchange>[]
  }
  export interface OfferCreationPayload {
    error: any,
    status: DealCreationStatus,
    deal: IDealCreation,
    trade_offer_created_at:number | null
    trade_offer_expiry_at:number | null

  }
export interface SocketEvents {
  [ESocketEvents.NEW_DEAL]: [deal: NewDealPayload, callback?: ResponseCallback];
  [ESocketEvents.OFFER_CREATION]: [OfferCreationPayload,callback?: ResponseCallback];
  [ESocketEvents.OFFER_CHANGED_STATE]: [OfferChangeStatePayload, callback?: ResponseCallback];
  [ESocketEvents.INVENTORY_FETCH]: [steamId: string, callback?: ResponseCallbackInventory];
  [ESocketEvents.READY]: [ready: boolean];
}

export interface ExtendedMEconItemExchange extends MEconItemExchange {
  paint_wear?: number
  paint_index?: number
  paint_seed?: number
  stickers?: Sticker[]
  tradable_after? : Date
}

export interface ExtendedEconItem extends CEconItem{
  paint_wear?: number
  paint_index?: number
  paint_seed?: number
  stickers?: Sticker[]
  tradable_after? : Date
}
export interface Sticker {
  sticker_id: number;
  /**
   * The sticker slot number, 0-5
   */
  slot: number;
  /**
   * The sticker's wear (how scratched it is), as a float.
   * `null` if not scratched at all.
   */
  wear: number | null;
  /**
   * Float, `null` if not applicable
   */
  scale: number | null;
  /**
   * Float, `null` if not applicable
   */
  rotation: number | null;
}