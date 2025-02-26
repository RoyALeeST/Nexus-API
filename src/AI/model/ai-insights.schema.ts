import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AIInsightsDocument = AIInsights & Document;

@Schema({ timestamps: true })
export class AIInsights {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  summary: string; // AI-generated summary

  @Prop({ type: [String] }) // List of recommendations
  recommendedActions: string[];

  @Prop({ required: true, min: 0, max: 1 })
  confidenceScore: number; // 0-1 confidence level
}

export const AIInsightsSchema = SchemaFactory.createForClass(AIInsights);
