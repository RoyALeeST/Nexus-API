import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { CreateProductDto } from '../dto/createProduct.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto, '60f8b15d9c62c8001e3a9b88'); // Replace with authenticated user ID
  }

  @Get(':userId')
  async getProducts(@Param('userId') userId: string) {
    return this.productService.getProductsByUser(userId);
  }
}
