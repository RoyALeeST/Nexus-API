import { UserDocument } from 'auth/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/user/user.schema';
import { Business, BusinessDocument } from 'business/schema/business.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createBusiness(data: any): Promise<Business> {
    const business = new this.businessModel(data);
    await business.save();

    await this.userModel.findByIdAndUpdate(data.owner, {
      $push: { businesses: business._id },
    });

    return business;
  }

  async getBusinessById(id: string): Promise<Business> {
    return this.businessModel.findById(id).populate('products sales').exec();
  }

  async getBusinessProducts(id: string): Promise<Business> {
    return this.businessModel.findById(id).populate('products').exec();
  }

  async getBusinessSales(id: string): Promise<Business> {
    return this.businessModel.findById(id).populate('sales').exec();
  }

  async updateBusiness(id: string, data: Partial<Business>): Promise<Business> {
    return this.businessModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteBusiness(id: string): Promise<void> {
    const business = await this.businessModel.findById(id);
    if (business) {
      await this.userModel.findByIdAndUpdate(business.owner, {
        $pull: { businesses: business._id },
      });
      await this.businessModel.findByIdAndDelete(id);
    }
  }
}
