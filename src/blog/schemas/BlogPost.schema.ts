import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema()
export class BlogPost {
  @Prop({
    required: true,
    unique: true,
    default: function genUUID() {
      return uuid();
    },
  })
  publicId: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  author: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: new Date() })
  creationDate: string;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
