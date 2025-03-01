import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from '../schema/inventory.schema';
import { User } from '../../auth/user/schema/user.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
  ) {}

  async createInventory(inventoryData: any, user: User): Promise<Inventory> {
    const inventory = new this.inventoryModel({
      ...inventoryData,
      owner: user._id,
    });
    return inventory.save();
  }

  async getInventoryById(id: string): Promise<Inventory> {
    const inventory = await this.inventoryModel.findById(id).exec();
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    return inventory;
  }

  async getBusinessInventory(businessId: string): Promise<Inventory[]> {
    return this.inventoryModel.find({ businessId }).exec();
  }

  async updateInventory(id: string, inventoryData: any): Promise<Inventory> {
    const updatedInventory = await this.inventoryModel
      .findByIdAndUpdate(id, inventoryData, { new: true })
      .exec();
    if (!updatedInventory) {
      throw new NotFoundException('Inventory not found');
    }
    return updatedInventory;
  }

  async deleteInventory(id: string): Promise<void> {
    const result = await this.inventoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Inventory not found');
    }
  }
}
