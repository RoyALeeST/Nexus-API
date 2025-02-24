import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { Role } from 'utils/enums/roles.enum';
import { UserCodesDetails } from './interfaces/useCodesDetails.interface';
import { v4 as uuid } from 'uuid';
import { UserVerificationDetails } from './interfaces/userVerificationDeatils.interface';

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

  @Prop()
  isEmailVerified: boolean;

  @Prop()
  emailVerificationCode: number;

  @Prop({ default: '' })
  accessToken: string;

  @Prop({ default: '' })
  refreshToken: string;

  @Prop({ type: Object, default: {} })
  userCodesDetails: UserCodesDetails;

  @Prop({ type: Object, default: {} })
  userVerificationDetails: UserVerificationDetails;

  @Prop({ default: new Date() })
  creationDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
