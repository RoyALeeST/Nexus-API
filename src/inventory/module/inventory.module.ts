import { UserSchema } from 'auth/user/user.schema';

import { BusinessSchema } from 'business/schema/business.schema';

import { ProductSchema } from 'product/model/product.schema';

import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'auth/user/user.schema';
import { UserController } from 'auth/user/controller/user.controller';
import { UserService } from 'auth/user/service/user.service';
import { Business } from 'business/schema/business.schema';
import { Product } from 'product/model/product.schema';
import { ProductService } from 'product/service/product.service';
import { Sale, SaleSchema } from 'sales/schema/sale.schema';
import { SaleService } from 'sales/service/sales.service';
import { Module } from '@nestjs/common';
import { ProductController } from 'product/controller/productController';
import { BusinessService } from 'business/service/business.service';
import { BusinessController } from 'business/controller/business.controller';
import { SaleController } from 'sales/controller/sale.controller';
import {
  ProductData,
  ProductDataSchema,
} from 'product/model/productData.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
    ]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: ProductData.name, schema: ProductDataSchema },
    ]),
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
  ],
  controllers: [
    UserController,
    BusinessController,
    ProductController,
    SaleController,
  ],
  providers: [UserService, BusinessService, ProductService, SaleService],
})
export class InventoryModule {}
