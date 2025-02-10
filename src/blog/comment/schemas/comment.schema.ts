import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from 'mongoose';
import { User } from "auth/users/user.schema";
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
  publicId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ default: new Date() })
  creationDate?: string;

  @Prop({ default: false })
  deleted: boolean;
  
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  upvoteUsers: User[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  downvoteUsers: User[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
