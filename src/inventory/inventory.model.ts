
import {AllowNull, AutoIncrement, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Model, NotNull, PrimaryKey, Table, Unique} from "sequelize-typescript";
import { ItemInv } from "src/Entities/ItemInv";
import { User } from "src/users/users.model";

export interface CreationInventoryAttr{
  userId:number,
  items: ItemInv[]
}


@Table({ tableName: 'inventory' })
export class Inventory extends Model<Inventory,CreationInventoryAttr> {
  @PrimaryKey
  @AutoIncrement
  @Column({type:DataType.BIGINT})
  declare id:number
  @ForeignKey(() => User)
  @Unique
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare items: ItemInv[];

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare updatedAt: Date;
}