import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../auth/user/schema/user.schema';

export type InventoryDocument = Inventory & Document;

@Schema()
export class Inventory {
  @Prop({ required: true })
  inventoryId: string;

  @Prop({ required: true })
  businessId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  minQuantity: number;

  @Prop()
  maxQuantity: number;

  @Prop()
  location: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
