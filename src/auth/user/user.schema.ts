import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { Role } from 'utils/enums/roles.enum';
import { v4 as uuid } from 'uuid';
import { UserCodesDetails } from 'auth/users/interfaces/useCodesDetails.interface';
import { UserVerificationDetails } from 'auth/users/interfaces/userVerificationDeatils.interface';

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

  @Prop({ default: new Date() })
  creationDate: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Business' }] })
  businesses: Types.ObjectId[];

  @Prop({ type: Object, default: {} })
  codeDetails: UserCodesDetails;

  @Prop({ type: Object, default: {} })
  verificationDetails: UserVerificationDetails;
}

export const UserSchema = SchemaFactory.createForClass(User);
