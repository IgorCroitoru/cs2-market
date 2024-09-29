import { EType } from "src/item-types/enums";
import { TypeService } from "src/item-types/type.service";

export async function seedTypes(ts:TypeService){
    try{
        Object.values(EType).forEach(async t=>{
            await ts.create({
                name: t
            })
        })
    }catch(e){
        console.error('Error seeding types', e)
    }
}