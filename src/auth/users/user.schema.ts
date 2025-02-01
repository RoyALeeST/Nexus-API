import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { Role } from 'utils/enums/roles.enum';
import { v4 as uuid } from 'uuid';


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document<Types.ObjectId> {
  @Prop({
    required: true,

    unique: true,
    default: function genUUID() {


      return uuid();
    },
  })
  publicId: string;

  @Prop()
  username: string;

  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  deleted: boolean;

  @Prop()
  roles: Role[];

  @Prop({ default: '' })
  accessToken: string;

  @Prop({ default: new Date() })
  creationDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
