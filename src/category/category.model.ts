import { AutoIncrement, BeforeCreate, BeforeUpdate, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { customSlugify } from "src/utils";
import { EFullCategory } from "./enums";

export interface CategoryCreationAttr {
    name: string,
    slug?: string
}

@Table({
    tableName: 'category',
    indexes:[
        {
            name: 'idx_category_name',
            fields: ['name']
        },
        {
            name: 'idx_category_slug',
            fields: ['slug']
        }
    ]
})
export class CategoryModel extends Model<CategoryModel,CategoryCreationAttr>{
    
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    id:number

    @Column({
        type:DataType.ENUM(...Object.values(EFullCategory)),
        allowNull: false,
        unique: true
    })
    name: string

    @Column({
        type:DataType.STRING,
        // allowNull: false
    })
    slug: string

    @BeforeCreate
    static async generateSlug(instance: CategoryModel) {
        if (instance.name && !instance.slug) {

            // Replace spaces and special characters with hyphens, and make the string lowercase
            instance.slug = await customSlugify(instance.name)
        }
    }

    @BeforeUpdate
    static async generateSlugUpdate(instance: CategoryModel) {
        if (instance.changed('name')) {
            // Replace spaces and special characters with hyphens, and make the string lowercase
            instance.slug = await customSlugify(instance.name)
        }
    }
}