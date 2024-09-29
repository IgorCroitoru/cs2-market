import slugify from "slugify";
import { ExtendedMEconItemExchange, OnlyProperties } from "src/Bots/bot-info-payload";
import { EFullCategory, EGlovesCategory } from "src/category/enums";
import { TradeStatusType } from "src/Deals/deal.model";
import { DepositStatusType } from "src/Deposit/deposit.model";
import { TradeDepositStatusType } from "src/Deposit/trade-deposit.model";
// import { TradeStatusType } from "src/Deposit/trade-deposit/trade-deposit.model";
import { ItemInv, Sticker } from "src/Entities/ItemInv";
import { EType, TypeSet } from "src/item-types/enums";
import { EExterior, ExteriorSet } from "src/product/enums";
import { MEconItemExchange } from "steam-tradeoffer-manager";
import CEconItem from "steamcommunity/classes/CEconItem";

export function checkItemsInInventory(inventory: ItemInv[], assetIds: string[]): boolean {

    const assetIdSet = new Set(inventory.map(item => item.assetid));
    return assetIds.every(assetId => assetIdSet.has(assetId));
  }

export function getMatchingItems(inventory: ItemInv[], assetIds: string[]): CEconItem[] {
    const assetIdSet = new Set(assetIds);
    return inventory
      .filter(item => assetIdSet.has(item.assetid))
      .map(item => item.ceeconitem); // Extract CEconItem from each matching item
  }

export function getDepositStatusByOfferStatus(offerStatus: TradeStatusType):DepositStatusType{
  switch(offerStatus){
    case "accepted":
      return "completed"
    case "assigned":
      return "pending"
    case "pending":
      return "pending"
    default: return "failed"
  }
}
export function getTradeDepositStatusByOfferStatus(offerStatus: TradeStatusType): TradeDepositStatusType{
  switch(offerStatus){
    case "accepted":
      return "completed"
    case "assigned":
      return "pending"
    case "pending":
      return "pending"
    default: return "failed"
  }
}
// export function generateItemSlug(itemName: string): string {
//   return itemName
//     .toLowerCase() // Convert to lowercase
//     .replace(/[^\w\s|()★]/g, '') // Remove special characters except ★ | ()
//     .replace(/\s+/g, '-') // Replace spaces with hyphens
//     .replace(/\|/g, '-')  // Replace '|' with a hyphen
//     .replace(/\(|\)/g, '') // Remove parentheses
//     .replace(/-+/g, '-') // Replace multiple hyphens with a single one
//     .trim(); // Trim any extra spaces or hyphens
// }
// export const customSlugify = (text: string) => {
//   const replaced = text.replace("|", "")
//   return slugify(replaced, {
//     lower: true,
//     remove: /[*+~.()'"!:@]/g,  // Explicitly remove the pipe (`|`) symbol
//   });
// };

export function customSlugify(skinName) {
  return skinName
      .toLowerCase() // Convert to lowercase
      .replace(/\|/g, '') // Remove the pipe character
      .replace(/[()]/g, '') // Remove parentheses
      // .replace(/[^\w\s★-]/g, '') // Remove special characters except ★ and hyphen
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
}


const getDopplerPhase = (paintIndex) => {
  const dopplerPhases = {
      // Doppler
      415: "Ruby",
      416: "Sapphire",
      417: "Black Pearl",
      418: "Phase 1",
      419: "Phase 2",
      420: "Phase 3",
      421: "Phase 4",

      // Gamma Doppler
      568: "Emerald",
      569: "Phase 1",
      570: "Phase 2",
      571: "Phase 3",
      572: "Phase 4",

      // Doppler (Butterfly Knife, Shadow Daggers)
      617: "Black Pearl",
      618: "Phase 2",
      619: "Sapphire",

      // Doppler (Talon Knife)
      852: "Phase 1",
      853: "Phase 2",
      854: "Phase 3",
      855: "Phase 4",

      // Gamma Doppler (Glock-18)
      1119: "Emerald",
      1120: "Phase 1",
      1121: "Phase 2",
      1122: "Phase 3",
      1123: "Phase 4",
  };

  return dopplerPhases?.[paintIndex];
};

export function  getInspectUrl(actions:any[],id64: string, assetId:number): string | null {
  if (!actions || !actions[0] || !actions[0].link) {
      return null;
  }
  const link = actions[0].link;
  return link
      .replace("%owner_steamid%", id64)
      .replace("%assetid%", assetId.toString())
      .replace('%20', '');
}


export function getNameTag(fraud: any[]): string | null {
  if (Array.isArray(fraud) && fraud.length > 0) {
      const fullTag = fraud[0];
      if (typeof fullTag === 'string' && fullTag.length > 13) {
          const stringWithoutFirst11 = fullTag.substring(12);
          const stringWithoutLast2 = stringWithoutFirst11.slice(0, -2);
          return stringWithoutLast2;
      }
  }
  return null; // Return undefined if input is invalid or no warnings
}
/**
* Extracts stickers from the last description in the provided array.
* @param descriptions Array of item descriptions
* @returns Array of Sticker objects extracted from the HTML content of the last description
*/
export function getStickers(descriptions: any[]): Sticker[] | null {
  let htmlContent: string = '';

  // Check if descriptions array exists and the last description has a non-empty value
  if (descriptions && descriptions.length > 0 && descriptions[descriptions.length - 1].value.trim() !== '') {
      htmlContent = descriptions[descriptions.length - 1].value;

      try {
          const srcRegex = /src="([^"]+)"/g;
          const stickerSrcMatches = htmlContent.match(srcRegex);

          const nameRegex = /Sticker: ([^<]+)/g;
          const stickerNameMatches = htmlContent.match(nameRegex);

          if (!stickerSrcMatches || !stickerNameMatches) {
              return null; // Return undefined if no matches found
          }

          const stickers: Sticker[] = [];
          const names = stickerNameMatches[0].replace('Sticker: ', '').split(', ');

          stickerSrcMatches.forEach((src, index) => {
              stickers.push(new Sticker(names[index], src.replace('src="', '').replace('"', '')));
          });

          return stickers;
      } catch (error) {
          return null; // Return undefined on error
      }
  }

  return null; // Return undefined if descriptions are empty or last description is empty
}


export function CEeconItemRehydration(item: any): CEconItem {
  try {
    // Validate that the essential properties exist
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid item: must be an object.');
    }

    const { descriptions, contextid } = item;

    // Check if descriptions and contextid are present
    if (!descriptions || !contextid) {
      throw new Error('Missing essential properties: descriptions or contextid.');
    }

    // Rehydrate and return a new CEconItem instance
    return new CEconItem(item, descriptions, contextid);
  } catch (error) {
    throw error
  }
}
export function MEconItemExchangeRehydration(item:any): MEconItemExchange{
  try {
    const ceeconitem = CEeconItemRehydration(item)

    const {
      appid,
      contextid,
      assetid,
      amount,
      classid,
      descriptions // assuming descriptions are still relevant
    } = item;

    if (
      typeof appid !== 'number' ||
      typeof contextid !== 'number' ||
      typeof assetid !== 'number' ||
      typeof amount !== 'number' ||
      typeof classid !== 'number' ||
      !descriptions
    ) {
      throw new Error('Missing essential properties for MEconItemExchange.');
    }
    return {
      ...ceeconitem, // Spread the properties of CEconItem
      appid,
      contextid,
      assetid,
      amount,
      classid,
      new_assetid: item.new_assetid,
      new_contextid: item.new_contextid,
      rollback_new_assetid: item.rollback_new_assetid,
      rollback_new_contextid: item.rollback_new_contextid,
    } as MEconItemExchange;
  } catch (error) {
    throw error
  }
}
//this should be CEconItem type
export function getItemExterior(item: CEconItem): EExterior | null {
    const exterior = item.getTag('Exterior')?.name;
    if(ExteriorSet.has(exterior)) return exterior
    else return null
}

// export function getItemType(item: CEconItem): EType{
//   const typeTag = item.getTag('Type').name
//   return typeTag
  
// }
export function getItemCategory(item: CEconItem): EFullCategory | null {
  try {
    const itemType = item.getTag('Type')?.name;

    // Check for gloves category
    if (itemType === 'Gloves') {
      for (const category of Object.values(EFullCategory)) {
        if(item.name.includes(category)) return category
      }
    }

    // Check for weapon category
    const weaponTag = item.getTag('Weapon');
    if (weaponTag) {
      return weaponTag.name as EFullCategory;
    }

    // Check for stickers category
    if (itemType === 'Sticker') {
      const stickerCapsule = item.getTag('StickerCapsule');
      const tournamentTag = item.getTag('Tournament');
      if(tournamentTag) return tournamentTag.name as EFullCategory
      else return stickerCapsule.name as EFullCategory
      
    }

    // If no category matched, return null
    return null;

  } catch (e) {
    throw e; // Re-throw the error for handling at a higher level
  }
}

export function hydrateItem<T>(item: OnlyProperties<T>, classType: { new (...args: any[]): T }): T {
  return new classType(item as any); // Replace `any` with appropriate constructor params
}

function hydrateArray<T>(rawItems: OnlyProperties<T>[], classType: { new (...args: any[]): T }): T[] {
  return rawItems.map(item => new classType(item as any)); // Modify the constructor params as needed
}

export function hydrateMEconItem(item: OnlyProperties<MEconItemExchange>): MEconItemExchange {
  // Assuming CEconItem is a class with a constructor that can accept these properties
  const econItem = new CEconItem(item.appid, item.contextid, item.assetid);
  
  // Assign any additional properties from MEconItemExchange
  Object.assign(econItem, item);
  
  return econItem as MEconItemExchange;
}

export function hydrateExtendedMEconItem(item: OnlyProperties<ExtendedMEconItemExchange>): ExtendedMEconItemExchange {
  const econItem = new CEconItem(item.appid, item.contextid, item.assetid);
  
  // Assign additional properties from ExtendedMEconItemExchange
  Object.assign(econItem, item);
  
  return econItem as ExtendedMEconItemExchange;
}

export function truncateFloat(value: number): number {
  // Ensure the value is within the range [0, 1]
  if (value < 0 || value > 1) {
      throw new Error('Value must be between 0 and 1');
  }

  // Convert the value to a string to handle precision
  const strValue = value.toString();
  
  // Split the value into integer and decimal parts
  const [integerPart, decimalPart] = strValue.split('.');

  // If there's no decimal part, return the value as is
  if (!decimalPart) {
      return value;
  }

  // Truncate the decimal part to the specified number of digits (18)
  const truncatedDecimalPart = decimalPart.slice(0, 18);
  
  // Construct the final number
  const finalValue = `${integerPart}.${truncatedDecimalPart}`;
  return parseFloat(finalValue);
}