import { Body, Controller, Post, UseFilters, UseGuards } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { CreateProductDto } from "./ProductCreationDto";
import { AuthenticatedGuard } from "src/auth/guards/custom.guard";
import { CustomExceptionFilter } from "src/exceptions/custom-exceptions.filter";


//TODO
//ROLES
@UseFilters(CustomExceptionFilter)
@Controller('product')
@UseGuards(AuthenticatedGuard)
export class ProductController{
    constructor(private readonly productService: ProductsService){}


    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto): Promise<{ id: number; success: boolean }> {
        return this.productService.createProduct(createProductDto);
    }

}