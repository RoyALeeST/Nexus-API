import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { InventoryService } from '../service/inventory.service';
import { Inventory } from '../schema/inventory.schema';
import { CurrentUser } from '@decorators/current-user.decorator';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async createInventory(
    @Body() inventoryData: any,
    @CurrentUser() user: any,
  ): Promise<Inventory> {
    return this.inventoryService.createInventory(inventoryData, user);
  }

  @Get(':id')
  async getInventoryById(@Param('id') id: string): Promise<Inventory> {
    return this.inventoryService.getInventoryById(id);
  }

  @Get('business/:businessId')
  async getBusinessInventory(
    @Param('businessId') businessId: string,
  ): Promise<Inventory[]> {
    return this.inventoryService.getBusinessInventory(businessId);
  }

  @Put(':id')
  async updateInventory(
    @Param('id') id: string,
    @Body() inventoryData: any,
  ): Promise<Inventory> {
    return this.inventoryService.updateInventory(id, inventoryData);
  }

  @Delete(':id')
  async deleteInventory(@Param('id') id: string): Promise<void> {
    return this.inventoryService.deleteInventory(id);
  }
}
