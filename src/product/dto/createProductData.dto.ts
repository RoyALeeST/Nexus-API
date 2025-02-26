import { IsNumber, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateProductDataDto {
  @IsString()
  productId: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}
