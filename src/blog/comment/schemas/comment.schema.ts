import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from 'auth/user/schema/user.schema';
import { v4 as uuid } from 'uuid';
import { Document } from 'mongoose';

@Schema()
export class Comment extends Document<MongooseSchema.Types.ObjectId> {
  @Prop({
    required: true,
    unique: true,

    default: function genUUID() {
      return uuid();
    },
  })
  userId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ type: Date, default: Date.now })
  creationDate?: Date;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  upvoteUsers: User[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  downvoteUsers: User[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
