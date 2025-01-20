import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'utils/enums/roles.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
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
  roles: Role[];

  @Prop({ default: '' })
  accessToken: string;

  @Prop({ default: new Date() })
  creationDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
