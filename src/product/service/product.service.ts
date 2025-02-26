import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../model/product.schema';
import { CreateProductDto } from '../dto/createProduct.dto';
import { ProductData, ProductDataDocument } from '../model/productData.schema';
import { CreateProductDataDto } from '../dto/createProductData.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductData.name)
    private productDataModel: Model<ProductDataDocument>,
  ) {}

  async createProduct(dto: CreateProductDto, userId: string): Promise<Product> {
    const product = new this.productModel({ ...dto, userId });
    return product.save();
  }

  async getProductsByUser(userId: string): Promise<Product[]> {
    return this.productModel.find({ userId }).exec();
  }

  async updateProduct(
    productId: string,
    dto: Partial<CreateProductDto>,
  ): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(productId, dto, { new: true })
      .exec();
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.productModel.findByIdAndDelete(productId).exec();
  }

  async addProductData(dto: CreateProductDataDto): Promise<ProductData> {
    const productData = new this.productDataModel(dto);
    return productData.save();
  }

  async getProductData(productId: string): Promise<ProductData[]> {
    return this.productDataModel
      .find({ productId })
      .sort({ timestamp: -1 })
      .exec();
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(id, { currentQuantity: quantity }, { new: true })
      .exec();
  }
}
