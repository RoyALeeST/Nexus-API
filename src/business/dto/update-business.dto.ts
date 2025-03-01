import { IsString, IsOptional } from 'class-validator';
import { BusinessCategory } from '../enums/businessCategory.enum';

export class UpdateBusinessDto {
  @IsString()
  @IsOptional()
  name?: string; // Optional update for business name

  @IsString()
  @IsOptional()
  category?: BusinessCategory; // Optional update for business category
}
