import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';

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

  async createUser(userData: any): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async getUserBusinesses(id: string): Promise<User> {
    return this.userModel.findById(id).populate('businesses');
  }
}
