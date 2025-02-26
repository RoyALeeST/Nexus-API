import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BusinessService } from '../service/business.service';
import { CreateBusinessDto } from 'business/dto/create-business.dto';
import { UpdateBusinessDto } from 'business/dto/update-business.dto';
import { BusinessResponseDto } from 'business/dto/business-response.dto';
import { AuthGuard } from 'auth/auth.guard';
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.createBusiness(createBusinessDto);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  async getBusinessesForUser(
    @Param('userId') userId: string,
  ): Promise<BusinessResponseDto[]> {
    return this.businessService.getBusinessesForUser(userId);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessService.updateBusiness(id, updateBusinessDto);
  }

  @Get(':businessId')
  @UseGuards(AuthGuard)
  async getBusinessById(
    @Param('businessId') businessId: string,
  ): Promise<BusinessResponseDto> {
    return this.businessService.getBusinessById(businessId);
  }

  @Get(':businessId/products')
  @UseGuards(AuthGuard)
  async getBusinessProducts(
    @Param('businessId') businessId: string,
  ): Promise<BusinessResponseDto> {
    return this.businessService.getBusinessProducts(businessId);
  }

  @Get(':businessId/sales')
  @UseGuards(AuthGuard)
  async getBusinessSales(
    @Param('businessId') businessId: string,
  ): Promise<BusinessResponseDto> {
    return this.businessService.getBusinessSales(businessId);
  }
}
