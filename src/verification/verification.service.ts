import { Injectable } from '@nestjs/common';
import { UserService } from 'auth/users/users.service';
import { CodeVerification } from './interfaces/codeVerification.interface';
import { User } from 'auth/users/user.schema';

@Injectable()
export class VerificationService {
  constructor(private readonly userService: UserService) {}

  async verifyCode(verificationData: CodeVerification) {
    const foundUser = await this.userService.findByEmail(
      verificationData.email,
    );

    if (!foundUser) {
      throw new Error('User not found');
    }

    if (foundUser.emailVerificationCode === verificationData.code) {
      try {
        foundUser.isEmailVerified = true;
        const updatedUser = await foundUser.save();
        return updatedUser;
      } catch (error) {
        throw new Error('Failed to verify code');
      }
    }
  }
}
