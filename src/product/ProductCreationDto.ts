import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateProductDto{

    @IsNotEmpty({ message: 'Bot item ID is required' })
    @IsNumber()
    bot_item_id: number

    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber()
    price: number

    list?: boolean
}