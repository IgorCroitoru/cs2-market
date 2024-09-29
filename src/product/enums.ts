export enum ERarity {
    EXTRAORDINARY = 'Extraordinary',
    MASTER = 'Master',
    COVERT = 'Covert',
    BASE_GRADE = 'Base Grade',
    CONSUMER_GRADE = 'Consumer Grade',
    CONTRABAND = 'Contraband',
    STOCK = 'Stock',
    EXOTIC = 'Exotic',
    SUPERIOR = 'Superior',
    CLASSIFIED = 'Classified',
    REMARKABLE = 'Remarkable',
    EXCEPTIONAL = 'Exceptional',
    RESTRICTED = 'Restricted',
    HIGH_GRADE = 'High Grade',
    DISTINGUISHED = 'Distinguished',
    MIL_SPEC_GRADE = 'Mil-Spec Grade',
    INDUSTRIAL_GRADE = 'Industrial Grade'

}

export const RaritySet = new Set(Object.values(ERarity))
// export type RarityType = 'Extraordinary'
//         | 'Master'
//         | 'Covert'
//         | 'Base Grade'
//         | 'Consumer Grade'
//         | 'Contraband'
//         | 'Stock'
//         | 'Exotic'
//         | 'Superior'
//         | 'Classified'
//         | 'Remarkable'
//         | 'Exceptional'
//         | 'Restricted'
//         | 'High Grade'
//         | 'Distinguished'
//         | 'Mil-Spec Grade'
//         | 'Industrial Grade'

// export type ExteriorType = 'Normal' | 'Factory New' | 'Minimal Wear' | 'Field-Tested' | 'Well-Worn' | 'Battle-Scarred' | 'Not Painted'

export enum EExterior {
    FACTORY_NEW = 'Factory New',
    MINIMAL_WEAR = 'Minimal Wear',
    FIELD_TESTED = 'Field-Tested',
    WELL_WORN = 'Well-Worn',
    BATTLE_SCARRED = 'Battle-Scarred',
    NOT_PAINTED = 'Not Painted',
   
}
export const ExteriorSet = new Set(Object.values(EExterior))
// export enum EQuality {
//     STAT_TRACK = 'StatTrak™',
//     SOUVENIR = 'Souvenir'
// }




