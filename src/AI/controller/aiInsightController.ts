import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { AIInsightsService } from '../service/aiInsight.service';
import { CreateAIInsightDto } from '../dto/createAIInsight.dto';

@Controller('ai-insights')
export class AIInsightController {
  constructor(private readonly aiInsightsService: AIInsightsService) {}

  // Create new AI insight
  @Post()
  async createAIInsight(@Body() dto: CreateAIInsightDto) {
    return this.aiInsightsService.createAIInsight(dto);
  }

  // Get AI insights for a specific product
  @Get('product/:productId')
  async getAIInsights(@Param('productId') productId: string) {
    return this.aiInsightsService.getAIInsights(productId);
  }

  // Update an existing AI insight
  @Put(':insightId')
  async updateAIInsight(
    @Param('insightId') insightId: string,
    @Body() dto: Partial<CreateAIInsightDto>,
  ) {
    return this.aiInsightsService.updateAIInsight(insightId, dto);
  }

  // Delete an AI insight
  @Delete(':insightId')
  async deleteAIInsight(@Param('insightId') insightId: string) {
    return this.aiInsightsService.deleteAIInsight(insightId);
  }
}
