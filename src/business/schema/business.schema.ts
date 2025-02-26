import { SchemaTypes } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { Product } from '../../product/model/product.schema';
import { User } from 'auth/user/schema/user.schema';
import { Sale } from '../../sales/schema/sale.schema';

export type BusinessDocument = Business & Document;

@Schema()
export class Business {
  @Prop({
    required: true,
    unique: true,
    default: function genUUID() {
      return uuid();
    },
  })
  businessId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string; // Ej: "Miscelánea", "Restaurante", "Maquiladora"

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Product' }] })
  products: Product[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Sale' }] })
  sales: Sale[];
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
