import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductCategory } from '../enum/productCategory.enum';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: ProductCategory;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: ['unidad', 'volumen', 'peso', 'longitud'] })
  measurementType: string;

  @Prop({ required: true })
  unit: string; // Ej: "ml", "kg", "m", "piezas"

  @Prop({ required: true })
  initialQuantity: number;

  @Prop({ required: true })
  currentQuantity: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Business' })
  business: Types.ObjectId;

  @Prop({ required: false })
  price?: number;

  @Prop({ type: Map, of: String }) // Custom attributes
  attributes?: Map<string, string>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
