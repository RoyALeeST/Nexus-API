import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../model/product.schema';
import { ProductController } from '../controller/productController';
import { ProductService } from '../service/product.service';
import { ProductDataSchema } from 'product/model/productData.schema';
import { ProductData } from 'product/model/productData.schema';
import { BusinessService } from 'business/service/business.service';
import { Business, BusinessSchema } from 'business/schema/business.schema';
import { User, UserSchema } from 'auth/user/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductData.name, schema: ProductDataSchema },
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, BusinessService, JwtService],
  exports: [ProductService, MongooseModule],
})
export class ProductModule {}
