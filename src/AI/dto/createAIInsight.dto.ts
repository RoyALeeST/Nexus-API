import { IsNumber, IsString, IsArray } from 'class-validator';

export class CreateAIInsightDto {
  @IsString()
  productId: string;

  @IsString()
  summary: string;

  @IsArray()
  recommendedActions: string[];

  @IsNumber()
  confidenceScore: number;
}
