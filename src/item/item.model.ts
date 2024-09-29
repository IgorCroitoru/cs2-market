import { AutoIncrement, BeforeCreate, BeforeUpdate, Column, DataType, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { customSlugify } from "src/utils";
export interface ItemCreationAttr{
    market_hash_name: string,
    slug?:string
}

@Table({
    tableName:'items',
    indexes:[
        {
            name:'idx_item_market_hash_name',
            fields: ['market_hash_name']
        },
        {
            name: 'idx_item_view_count',
            fields: ['view_count']
        },
        {
            name: 'idx_item_last_listed',
            fields: ['last_listed']
        },
        {
            name: 'idx_item_total_sold',
            fields: ['total_sold']
        },
        {
            name: 'idx_item_slug',
            fields: ['slug']
        },
        {
            name: 'idx_item_custom_id',
            fields: ['custom_id']
        }
    ]
})
export class ItemModel extends Model<ItemModel,ItemCreationAttr>{

    @PrimaryKey
    @AutoIncrement
    @Column({
        type:DataType.INTEGER,
    })
    id: number

    
    @Column({
        type:DataType.STRING(150),
        allowNull: false,
       // unique: true
    })
    market_hash_name: string

    @Column({
        type:DataType.DATE,
        allowNull: true,
        defaultValue: null
    })
    last_listed: Date | null

    @Column({
        type:DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    view_count: number

    @Column({
        type:DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    total_sold: number

    
    @Column({
        type:DataType.STRING,
        allowNull: true,
        //unique:true
    })
    slug:string

    @Column({
        type: DataType.SMALLINT,
        allowNull:true
    })
    custom_id: number

    @Column({
        type: DataType.STRING(310),
        allowNull: true,
      })
    icon_url: string;
    @BeforeCreate
    static async generateSlug(instance: ItemModel) {
        if (instance.market_hash_name) {

            // Replace spaces and special characters with hyphens, and make the string lowercase
            instance.slug = await ItemModel.generateUniqueSlug(instance.market_hash_name);
        }
    }

    @BeforeUpdate
    static async generateSlugUpdate(instance: ItemModel) {
        if (instance.changed('market_hash_name')) {
            // Replace spaces and special characters with hyphens, and make the string lowercase
            instance.slug = await ItemModel.generateUniqueSlug(instance.market_hash_name);
        }
    }
    static async generateUniqueSlug(name: string): Promise<string> {
        let slug = customSlugify(name);  // Your existing slug generation function
        let uniqueSlug = slug;
        let count = 1;

        // Check if the slug already exists in the database
        let slugExists = await ItemModel.findOne({ where: { slug: uniqueSlug } });

        // If slug exists, append a unique number to it
        while (slugExists) {
            uniqueSlug = `${slug}-${count}`;
            count++;
            slugExists = await ItemModel.findOne({ where: { slug: uniqueSlug } });
        }

        return uniqueSlug;
    }
}