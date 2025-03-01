import { IsString, IsNotEmpty } from 'class-validator';
import { BusinessCategory } from '../enums/businessCategory.enum';
export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Business name

  @IsString()
  @IsNotEmpty()
  category: BusinessCategory; // Type of business (e.g., "Miscelánea", "Restaurante")
}
