import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'auth/user/service/user.service';
import { CodeVerification } from './interfaces/codeVerification.interface';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthService } from 'auth/auth.service';
@Injectable()
export class VerificationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
        console.log(error);
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

    if (foundUser.codeDetails.passwordResetToken === verificationData.code) {
      try {
        if (
          foundUser.codeDetails.passwordResetTokenExpires < new Date(Date.now())
        ) {
          throw new HttpException('Codigo Expirado', HttpStatus.BAD_REQUEST);
        }
        foundUser.codeDetails.passwordResetToken = null;
        foundUser.codeDetails.passwordResetTokenExpires = null;

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
        console.log(error);
        throw new HttpException(
          'Error al verificar el codigo',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException('Codigo Invalido', HttpStatus.BAD_REQUEST);
  }
}
