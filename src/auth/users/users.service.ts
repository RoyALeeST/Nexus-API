import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ email: email });
  }

  async updateUser(id: string, user: User): Promise<User | undefined> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user);
    return updatedUser;
  }

  async findByEmail(email: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ email: email });
  }

  async findByEmailVerificationCode(
    emailVerificationCode: number,
  ): Promise<UserDocument | undefined> {
    return this.userModel.findOne({
      'userCodesDetails.emailVerificationCode': emailVerificationCode,
    });
  }
}
