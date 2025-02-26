import { AIInsightsDocument } from 'AI/model/ai-insights.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAIInsightDto } from 'AI/dto/createAIInsight.dto';
import { AIInsights } from 'AI/model/ai-insights.schema';
import { Model } from 'mongoose';

@Injectable()
export class AIInsightsService {
  constructor(
    @InjectModel(AIInsights.name)
    private aiInsightsModel: Model<AIInsightsDocument>,
  ) {}

  async createAIInsight(dto: CreateAIInsightDto): Promise<AIInsights> {
    const insight = new this.aiInsightsModel(dto);
    return insight.save();
  }

  async getAIInsights(productId: string): Promise<AIInsights[]> {
    return this.aiInsightsModel
      .find({ productId })
      .sort({ generatedAt: -1 })
      .exec();
  }

  async updateAIInsight(
    insightId: string,
    dto: Partial<CreateAIInsightDto>,
  ): Promise<AIInsights> {
    return this.aiInsightsModel
      .findByIdAndUpdate(insightId, dto, { new: true })
      .exec();
  }

  async deleteAIInsight(insightId: string): Promise<void> {
    await this.aiInsightsModel.findByIdAndDelete(insightId).exec();
  }
}
