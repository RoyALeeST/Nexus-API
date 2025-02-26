import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// (Product Sales Data for Charts & AI) - This class is used to store the sales data for a product
export type ProductDataDocument = ProductData & Document;

@Schema({ timestamps: true })
export class ProductData {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  value: number; // Could be sales count, revenue, etc.

  @Prop({ type: Map, of: String }) // Metadata like "customerRating", "socialMediaMentions"
  metadata?: Map<string, string>;
}

export const ProductDataSchema = SchemaFactory.createForClass(ProductData);
ProductDataSchema.index({ productId: 1, timestamp: -1 }); // Optimize queries for charts
