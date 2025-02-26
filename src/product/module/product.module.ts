import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../model/product.schema';
import { ProductController } from '../controller/productController';
import { ProductService } from '../service/product.service';
import { ProductDataSchema } from 'product/model/productData.schema';
import { ProductData } from 'product/model/productData.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductData.name, schema: ProductDataSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, MongooseModule],
})
export class ProductModule {}
