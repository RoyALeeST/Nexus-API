import { Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type BusinessDocument = Business & Document;

@Schema()
export class Business {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string; // Ej: "Miscelánea", "Restaurante", "Maquiladora"

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  products: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Sale' }] })
  sales: Types.ObjectId[];
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
