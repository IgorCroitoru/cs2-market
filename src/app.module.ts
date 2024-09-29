import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from "./users/users.model";
import { AuthModule } from "./auth/auth.module";
import { PassportModule } from "@nestjs/passport";
import { UsersController } from "./users/users.controller";
import { SteamStrategy } from "./auth/strategies/steam.strategy";
import { SessionSerializer } from "./auth/serializer";
import { InventoryModule } from "./inventory/inventory.module";
import { Inventory } from "./inventory/inventory.model";
import { BotsModule } from "./Bots/bots.module";
import { DepositModule } from "./Deposit/deposit.module";
import { BotModel } from "./Bots/bots.model";
import { DepositModel } from "./Deposit/deposit.model";
import { OfferErrorModel, TradeDeal } from "./Deals/deal.model";
import { BotItemInventoryModel } from "./bot-inventory/bot-inventory.model";
import { BotInventoryModule } from "./bot-inventory/bot-inventory.module";
import { DealModule } from "./Deals/deal.module";
import { TradeDealDetailModel } from "./Deals/deal-deposit-items.model";
import { TradeDepositModel } from "./Deposit/trade-deposit.model";
import { SeederService } from './seeds/seeder.service';
import { HttpModule } from "@nestjs/axios";
import { ItemModule } from "./item/item.module";
import { ItemModel } from "./item/item.model";
import { TypeModel } from "./item-types/type.model";
import { CategoryModel } from "./category/category.model";
import { CategoryModule } from "./category/category.module";
import { TypeModule } from "./item-types/type.module";
import { ProductModel } from "./product/product.model";
import { ProductModule } from "./product/product.module";
@Module({
    controllers:[],
    providers:[SeederService],
    imports:[
        HttpModule,
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres', // or 'mysql', 'sqlite', 'mariadb', 'mssql'
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            models: [User,
                Inventory,
                TradeDeal,
                TradeDealDetailModel,
                BotModel,
                OfferErrorModel,
                DepositModel,
                BotItemInventoryModel,
                TradeDepositModel,
                ItemModel,
                TypeModel,
                CategoryModel,
                ProductModel
            ],
            autoLoadModels: true,
            logging: true,
            synchronize: true, // Only for development, not recommended for production
            pool: {
                max: 10, // Increase max connections
                min: 0,
                acquire: 30000,
                idle: 10000
              },
            
          }),
        //   SequelizeModule.forFeature([User,Inventory, TradeDeal, TradeDealItemModel,BotModel,OfferErrorModel,DepositModel,BotInventoryModel,BotItemStickerModel]),
        AuthModule,
        InventoryModule,
        BotsModule,
        DepositModule,
        UsersModule,
        BotInventoryModule,
        DealModule,
        ItemModule,
        CategoryModule,
        TypeModule,
        ProductModule
    ]
})
export class AppModule{}