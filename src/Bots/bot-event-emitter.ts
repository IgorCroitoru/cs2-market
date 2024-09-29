import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { OfferStateChangeEvent } from './events/offer-state-change.event';
import { OfferChangeStatePayload, OfferCreationPayload } from './bot-info-payload';

export enum BotEvents {
    OFFER_STATE_CHANGE = 'offer.change.state',
    OFFER_CREATION = 'offer.creation',
    BOT_READY = 'bot.ready'
}
export type BotId = {botId: number}
interface BotEventPayloads {
    [BotEvents.OFFER_STATE_CHANGE]: OfferChangeStatePayload & BotId;
    [BotEvents.OFFER_CREATION]: OfferCreationPayload & BotId;
    // [BotEvents.BOT_READY]: BotReadyPayload;
}

@Injectable()
export class BotEventEmitter {
  constructor(private eventEmitter: EventEmitter2) {}

  emit<K extends keyof BotEventPayloads>(event: K, payload: BotEventPayloads[K]): void {
    this.eventEmitter.emit(event, payload);
    }

  on<K extends keyof BotEventPayloads>(event: K, listener: (payload: BotEventPayloads[K]) => void): void {
        this.eventEmitter.on(event, listener);
    }
  // Define event emitters for the specific events
  emitOfferStateChange(botId: number , offerStateChangeEvent: OfferChangeStatePayload) {
    this.emit(BotEvents.OFFER_STATE_CHANGE, {botId, ...offerStateChangeEvent});
  }

  emitOfferCreation(botId: number, offerCreationEvent: OfferCreationPayload) {
    this.emit(BotEvents.OFFER_CREATION, { botId, ...offerCreationEvent });
  }
 

  onOfferStateChange(listener: (data: BotEventPayloads[BotEvents.OFFER_STATE_CHANGE]) => void) {
    this.on(BotEvents.OFFER_STATE_CHANGE, listener);
  }

  onOfferCreation(listener: (data: BotEventPayloads[BotEvents.OFFER_CREATION]) => void) {
        this.on(BotEvents.OFFER_CREATION, listener);
    }

}
