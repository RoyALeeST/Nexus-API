import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Product } from 'product/model/product.schema';

export type SaleDocument = Sale & Document;

@Schema()
export class Sale {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Business' })
  business: Types.ObjectId;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Product' }] })
  products: Product[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: Date.now })
  date: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
