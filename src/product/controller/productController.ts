import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { CreateProductDto } from '../dto/createProduct.dto';
import { AuthGuard } from 'auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() newProduct: CreateProductDto) {
    return this.productService.createProduct(newProduct);
  }

  @Get('user/:userId')
  async getProductsForUser(@Param('userId') userId: string) {
    return this.productService.getProductsByUser(userId);
  }

  @Get(':productId')
  async getProductDetails(@Param('productId') productId: string) {
    return this.productService.getProductDetails(productId);
  }

  @Get(':productId/data')
  async getProductData(@Param('productId') productId: string) {
    return this.productService.getProductData(productId);
  }
}
