import { Business } from 'business/schema/business.schema';

import { Product } from 'product/model/product.schema';

import { BusinessDocument } from 'business/schema/business.schema';

import { ProductDocument } from 'product/model/product.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Sale, SaleDocument } from 'sales/schema/sale.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaleService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) {}

  async registerSale(data: any): Promise<Sale> {
    const sale = new this.saleModel(data);
    await sale.save();

    // Descontar del inventario
    for (const item of data.products) {
      await this.productModel.findByIdAndUpdate(item.product, {
        $inc: { currentQuantity: -item.quantity },
      });
    }

    // Agregar venta al negocio
    await this.businessModel.findByIdAndUpdate(data.business, {
      $push: { sales: sale._id },
    });

    return sale;
  }

  async getSalesByBusiness(businessId: string): Promise<Sale[]> {
    return this.saleModel
      .find({ business: businessId })
      .populate('products.product')
      .exec();
  }

  async getSaleById(id: string): Promise<Sale> {
    return this.saleModel.findById(id).exec();
  }

  async updateSale(id: string, data: any): Promise<Sale> {
    return this.saleModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteSale(id: string): Promise<void> {
    await this.saleModel.findByIdAndDelete(id).exec();
  }
}
