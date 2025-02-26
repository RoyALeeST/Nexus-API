import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../model/product.schema';
import { CreateProductDto } from '../dto/createProduct.dto';
import { ProductData, ProductDataDocument } from '../model/productData.schema';
import { CreateProductDataDto } from '../dto/createProductData.dto';
import { Business, BusinessDocument } from 'business/schema/business.schema';
import { ProductResponseDto } from 'product/dto/productResponseDto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductData.name)
    private productDataModel: Model<ProductDataDocument>,
  ) {}

  async createProduct(
    newProduct: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const foundBusiness = await this.businessModel.findOne({
      businessId: newProduct.businessId,
    });
    if (!foundBusiness) {
      throw new NotFoundException('Business not found');
    }
    const product = new this.productModel({
      ...newProduct,
      business: foundBusiness._id,
    });
    const savedProduct = await product.save();

    foundBusiness.products.push(savedProduct);
    await foundBusiness.save();
    await savedProduct.populate('business', 'businessId');
    return new ProductResponseDto(savedProduct);
  }

  async getProductsByUser(userId: string): Promise<Product[]> {
    return this.productModel.find({ userId }).exec();
  }

  async getProductDetails(productId: string): Promise<Product> {
    return this.productModel.findById(productId).exec();
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
