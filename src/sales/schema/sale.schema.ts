import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema()
export class Sale {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Business' })
  business: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product' },
        quantity: Number,
        totalPrice: Number,
      },
    ],
  })
  products: { product: Types.ObjectId; quantity: number; totalPrice: number }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: Date.now })
  date: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
