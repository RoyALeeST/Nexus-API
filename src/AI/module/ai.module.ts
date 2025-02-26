import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AIInsights, AIInsightsSchema } from '../model/ai-insights.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AIInsights.name, schema: AIInsightsSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AIInsightModule {}
