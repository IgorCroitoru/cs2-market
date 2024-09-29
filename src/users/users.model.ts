import { All } from "@nestjs/common";
import { DATE } from "sequelize";
import {AllowNull, AutoIncrement, BelongsToMany, Column, DataType, Default, HasMany, Model, NotNull, PrimaryKey, Table, Unique} from "sequelize-typescript";
import { Col } from "sequelize/types/utils";

interface UserCreationAttrs{
    steamId64: string,
    username:string,
    avatar?:string
}
@Table({tableName: 'users'})
export class User extends Model<User,UserCreationAttrs>{
    @PrimaryKey
    @AutoIncrement
    @Column({type: DataType.INTEGER})
    userId:number;

    @Unique
    @Column({type:DataType.STRING(17), allowNull:false})
    steamId64:string

    @Unique
    @Column({type:DataType.STRING(30),allowNull:true})
    email:string

    @Column({type:DataType.STRING(90),allowNull: true})
    tradeOfferUrl: string
    
    @Column({type:DataType.STRING})
    avatar:string

   
    @Column({ type: DataType.STRING})
    username: string;

    @Default(DataType.NOW)
    @Column({type:DataType.DATE})
    createdAt: Date;
}