import { CategoryService } from "src/category/category.service";
import { EFullCategory } from "src/category/enums";

export async function seedCategories( categoryService:CategoryService){
    try{
        Object.values(EFullCategory).forEach(async c=>{
            await categoryService.create({
                name: c
            })
        })
    }catch(e){
        console.error('Error seeding categories:' ,e)
    }
}