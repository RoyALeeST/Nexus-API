import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Role } from 'utils/enums/roles.enum';
import { MailService } from 'mail/mail.service';
import { AuthRequest } from './interfaces/authRequest.interface';

const ms = require('ms');

@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService
   * @param userModel - The injected User model
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private UserService: UserService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  /**
   * Authenticates a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to the authenticated User or null if not found
   */
  async login(
    userData: User,
    response: Response,
  ): Promise<{ accessToken: string }> {
    const user = await this.UserService.findOne(userData.email);
    const isMatch = await bcrypt.compare(userData.password, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const accessToken = await this.jwtService.signAsync({
      email: user.email,
      roles: user.roles,
    });
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    user.accessToken = accessToken;
    await this.UserService.updateUser(user.id, user);

    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow<string>('JWT_EXPIRATION')),
    );

    response.cookie('Authentication', accessToken, {
      secure: true,
      httpOnly: true,
      expires,
    });

    return { accessToken };
  }

  /**
   * Registers a new user
   * @param user - User data to register
   * @returns Promise resolving to the created User
   */
  async register(user: User): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: user.email });
    if (existingUser) {
      throw new NotFoundException('User already exists');
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(user.password, salt);
    const isMatch = await bcrypt.compare(user.password, hash);
    user.password = hash;

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    user.roles = [Role.User, Role.Regular];
    user.isEmailVerified = false;
    user.emailVerificationCode = Math.floor(100000 + Math.random() * 900000);

    try {
      const emailResponse = await this.mailService.sendEmail(
        user.email,
        'Welcome to Master Bet',
        'Este es tu código de verificación: ' + user.emailVerificationCode,
      );
      if (!emailResponse) {
        throw new BadRequestException('Error sending email');
      }

      const newUser = await this.userModel.create(user);

      return newUser;
    } catch (error) {
      throw new BadRequestException('Error creando usuario');
    }
  }

  /**
   * Initiates password reset for a user
   * @param email - Email of user requesting password reset
   * @returns Promise resolving to the found User or null
   */
  async forgotPassword(email: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      {
        $set: {
          userCodesDetails: {
            passwordResetToken: Math.floor(100000 + Math.random() * 900000),
            passwordResetTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
          },
        },
      },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.mailService.sendEmail(
        user.email,
        'Password Reset',
        'Este es tu código de restablecimiento de contraseña: ' +
          user.userCodesDetails.passwordResetToken,
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error sending email');
    }
    return user;
  }

  async resetPassword(passResetRequest: AuthRequest): Promise<User> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(passResetRequest.password, salt);
    const isMatch =
      passResetRequest.password === passResetRequest.passwordConfirmation;

    if (!isMatch) {
      throw new UnauthorizedException('Las contraseñas no coinciden');
    }

    const foundUser = await this.userModel.findOneAndUpdate(
      { email: passResetRequest.email },
      { $set: { password: hash } },
      { new: true },
    );
    if (!foundUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return foundUser;
  }

  isTokenExpired(payload: any): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.UserService.findOne(email);
      const authenticated = await bcrypt.compare(password, user?.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  setAuthCookie(response: Response, accessToken: string) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow<string>('JWT_EXPIRATION')),
    );
    response.cookie('Authentication', accessToken, {
      secure: true,
      httpOnly: true,
      expires,
    });
  }
}
