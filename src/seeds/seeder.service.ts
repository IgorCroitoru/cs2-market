import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; // For API requests
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs'
import { ItemService } from 'src/item/item.service';
import { ItemCreationAttr } from 'src/item/item.model';
import { seedCategories } from './category';
import { seedCsItems } from './items';
import { CategoryService } from 'src/category/category.service';
import { seedTypes } from './types';
import { TypeService } from 'src/item-types/type.service';
// import { ProductsService } from 'src/products/products.service'; // Your Product service to handle DB operations

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly itemService: ItemService,
    private readonly categoryService: CategoryService,
    private readonly typeService: TypeService
    // private readonly productsService: ProductsService, // To save to the DB
  ) {}

  async seedCsItems() {
    return await  seedCsItems(this.itemService)
  }

  async seedCategories(){
    return await seedCategories(this.categoryService)
  }

  async seedTypes(){
    return await seedTypes(this.typeService)
  }
}