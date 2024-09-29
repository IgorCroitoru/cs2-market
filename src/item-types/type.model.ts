import { BeforeCreate, BeforeUpdate, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { customSlugify } from "src/utils";
import { EType } from "./enums";

export interface TypeCreationAttr {
    name: string
    slug?:string
}

@Table({
    tableName:'types',
    indexes:[
        {
            name: 'idx_type_name',
            fields:['name']
        },
        {
            name: 'idx_type_slug',
            fields: ['slug']
        }
    ]
})
export class TypeModel extends Model<TypeModel,TypeCreationAttr>{
    
    @PrimaryKey
    @Column({
        type: DataType.SMALLINT,
        autoIncrement: true
    })
    id:number

    @Column({
        type:DataType.ENUM(...Object.values(EType)),
        allowNull: false
    })
    name: string

    @Column({
        type: DataType.STRING,
        
    })
    slug: string

    @BeforeCreate
    static async generateSlug(instance: TypeModel) {
        if (instance.name && !instance.slug) {

            // Replace spaces and special characters with hyphens, and make the string lowercase
            instance.slug = await customSlugify(instance.name)
        }
    }

    @BeforeUpdate
    static async generateSlugUpdate(instance: TypeModel) {
        if (instance.changed('name')) {
            // Replace spaces and special characters with hyphens, and make the string lowercase
            instance.slug = await customSlugify(instance.name)
        }
    }
}