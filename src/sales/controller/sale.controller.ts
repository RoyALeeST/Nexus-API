import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SaleService } from '../service/sales.service';
import { Sale } from '../schema/sale.schema';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  async registerSale(@Body() data: any): Promise<Sale> {
    return this.saleService.registerSale(data);
  }

  @Get('business/:businessId')
  async getSalesByBusiness(
    @Param('businessId') businessId: string,
  ): Promise<Sale[]> {
    return this.saleService.getSalesByBusiness(businessId);
  }

  @Get(':id')
  async getSaleById(@Param('id') id: string): Promise<Sale> {
    return this.saleService.getSaleById(id);
  }

  @Post(':id')
  async updateSale(@Param('id') id: string, @Body() data: any): Promise<Sale> {
    return this.saleService.updateSale(id, data);
  }

  @Delete(':id')
  async deleteSale(@Param('id') id: string): Promise<void> {
    return this.saleService.deleteSale(id);
  }
}
