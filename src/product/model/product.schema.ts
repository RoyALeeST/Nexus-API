import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ProductCategory } from '../enum/productCategory.enum';
import { ProductUnit } from '../enum/productUnit.enum';
import { ProductMeasurementType } from '../enum/productMeasurementType.enum';
import { v4 as uuid } from 'uuid';
import { Business } from 'business/schema/business.schema';
export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    required: true,

    unique: true,
    default: function genUUID() {
      return uuid();
    },
  })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: ProductCategory;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: ProductMeasurementType })
  measurementType: ProductMeasurementType;

  @Prop({ required: true, enum: ProductUnit })
  unit: ProductUnit;

  @Prop({ required: true })
  initialQuantity: number;

  @Prop({ required: true })
  currentQuantity: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Business' })
  business: Business;

  @Prop({ required: false })
  price?: number;

  @Prop({ type: Map, of: String }) // Custom attributes
  attributes?: Map<string, string>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
