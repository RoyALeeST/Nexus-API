import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { User } from 'auth/users/user.schema';
import { CommentSchema } from '@blog/comment/schemas/comment.schema';

@Schema()
export class BlogPost extends Document<MongooseSchema.Types.ObjectId> {
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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ default: 0 })
  rating?: number;

  @Prop({ default: false })
  deleted?: boolean;

  @Prop({ default: new Date() })
  creationDate?: string;

  @Prop()
  thumbnail?: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  upvoteUsers: User[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  downvoteUsers: User[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
