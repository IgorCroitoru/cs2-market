export enum EType {
    ANY = 'Any',
    PISTOL = 'Pistol',
    RIFLES = 'Rifle',
    HEAVY = 'Heavy',
    SNIPER_RIFLE = 'Sniper Rifle',
    SHOTGUN = 'Shotgun',
    SMG = 'SMG' ,
    GEAR = 'GEAR',
    GRENADES = 'Grenade',
    NONE = 'None',
    EQUIPMENT = 'Equipment', // Zeus
    AGENT = 'Agent',
    CONTAINER = 'Container',
    STICKER = 'Sticker',
    GLOVES = 'Gloves',
    KNIFE = 'Knife',
    MUSIC_KIT = 'Music Kit',
    COLLECTIBLE = 'Collectible',
    GRAFFITI = 'Graffiti',
    KEY = 'Key',
    PASS = 'Pass',
    PATCH = 'Patch',
    TAG = 'Tag',
    TOOL = 'Tool',
    GIFT = 'Gift'
}
export const TypeSet = new Set(Object.values(EType))