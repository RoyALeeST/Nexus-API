import { IsString, IsOptional, IsObject, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  businessId?: string;

  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, string>;

  @IsOptional()
  @IsString()
  measurementType?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  initialQuantity?: number;

  @IsOptional()
  @IsNumber()
  currentQuantity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}
