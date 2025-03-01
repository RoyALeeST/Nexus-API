import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BusinessService } from '../service/business.service';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { BusinessResponseDto } from '../dto/business-response.dto';
import { CurrentUser } from '@decorators/current-user.decorator';
import { User } from '../../auth/user/schema/user.schema';
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('create')
  create(
    @Body() createBusinessDto: CreateBusinessDto,
    @CurrentUser() user: User,
  ) {
    console.log(user);
    return this.businessService.createBusiness(createBusinessDto, user);
  }

  @Get('user/:userId')
  async getBusinessesForUser(
    @Param('userId') userId: string,
  ): Promise<BusinessResponseDto[]> {
    return this.businessService.getBusinessesForUser(userId);
  }

  @Post(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessService.updateBusiness(id, updateBusinessDto);
  }

  @Get(':businessId')
  async getBusinessById(
    @Param('businessId') businessId: string,
  ): Promise<BusinessResponseDto> {
    return this.businessService.getBusinessById(businessId);
  }

  @Get(':businessId/products')
  async getBusinessProducts(
    @Param('businessId') businessId: string,
  ): Promise<BusinessResponseDto> {
    return this.businessService.getBusinessProducts(businessId);
  }

  @Get(':businessId/sales')
  async getBusinessSales(
    @Param('businessId') businessId: string,
  ): Promise<BusinessResponseDto> {
    return this.businessService.getBusinessSales(businessId);
  }
}
