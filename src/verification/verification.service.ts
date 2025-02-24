import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'auth/users/users.service';
import { CodeVerification } from './interfaces/codeVerification.interface';
import { User } from 'auth/users/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from 'auth/auth.service';
const ms = require('ms');
@Injectable()
export class VerificationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}
  /**
   * Verifies the email verification code for a user
   * @param verificationData Object containing email and verification code
   * @returns Updated user object with verified email status
   * @throws HttpException if user not found, invalid code, or verification error
   */
  async verifyEmailCode(verificationData: CodeVerification) {
    const foundUser = await this.userService.findByEmail(
      verificationData.email,
    );

    if (!foundUser) {
      throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.emailVerificationCode === verificationData.code) {
      try {
        foundUser.isEmailVerified = true;
        const updatedUser = await foundUser.save();
        return updatedUser;
      } catch (error) {
        throw new HttpException(
          'Error al verificar el codigo',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException('Codigo Invalido', HttpStatus.BAD_REQUEST);
  }

  /**
   * Verifies the password reset code for a user
   * @param verificationData Object containing email and reset code
   * @returns Updated user object with cleared reset token
   * @throws HttpException if user not found, invalid/expired code, or verification error
   */
  async verifyPasswordResetCode(
    verificationData: CodeVerification,
    response: Response,
  ) {
    const foundUser = await this.userService.findByEmail(
      verificationData.email,
    );

    if (!foundUser) {
      throw new HttpException('Usuario no encontrado', HttpStatus.BAD_REQUEST);
    }

    if (
      foundUser.userCodesDetails.passwordResetToken === verificationData.code
    ) {
      try {
        if (
          foundUser.userCodesDetails.passwordResetTokenExpires <
          new Date(Date.now())
        ) {
          throw new HttpException('Codigo Expirado', HttpStatus.BAD_REQUEST);
        }
        foundUser.userCodesDetails.passwordResetToken = null;
        foundUser.userCodesDetails.passwordResetTokenExpires = null;

        const accessToken = await this.jwtService.signAsync({
          email: foundUser.email,
          roles: foundUser.roles,
        });

        if (!accessToken) {
          throw new HttpException(
            'Error generating access token',
            HttpStatus.BAD_REQUEST,
          );
        }

        foundUser.accessToken = accessToken;

        const updatedUser = await this.userService.updateUser(
          foundUser.id,
          foundUser,
        );
        if (!updatedUser) {
          throw new HttpException(
            'Error al verificar el codigo',
            HttpStatus.BAD_REQUEST,
          );
        }

        this.authService.setAuthCookie(response, accessToken);

        return { accessToken };
      } catch (error) {
        throw new HttpException(
          'Error al verificar el codigo',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException('Codigo Invalido', HttpStatus.BAD_REQUEST);
  }
}
