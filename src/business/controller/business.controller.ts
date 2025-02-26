import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BusinessService } from '../service/business.service';
import { Business } from '../schema/business.schema';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  async createBusiness(@Body() data: any): Promise<Business> {
    return this.businessService.createBusiness(data);
  }

  @Get(':id')
  async getBusinessById(@Param('id') id: string): Promise<Business> {
    return this.businessService.getBusinessById(id);
  }

  @Get(':id/products')
  async getBusinessProducts(@Param('id') id: string): Promise<Business> {
    return this.businessService.getBusinessProducts(id);
  }

  @Get(':id/sales')
  async getBusinessSales(@Param('id') id: string): Promise<Business> {
    return this.businessService.getBusinessSales(id);
  }
}
