import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService
   * @param userModel - The injected User model
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user
   * @param user - User data to register
   * @returns Promise resolving to the created User
   */
  async register(user: User): Promise<User> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(user.password, salt);
    const isMatch = await bcrypt.compare(user.password, hash);
    user.password = hash;
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    return this.userModel.create(user);
  }

  /**
   * Authenticates a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to the authenticated User or null if not found
   */
  async signIn(email: string, pass: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(email);
    const isMatch = await bcrypt.compare(pass, user?.password);
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
    await this.usersService.updateUser(user.id, user);
    return {
      accessToken: accessToken,
    };
  }

  /**
   * Logs out a user
   * @param user - User to logout
   * @returns Promise resolving to the found User or null
   */
  async logout(user: User): Promise<User> {
    const { email, password } = user;
    return this.userModel.findOne({ email, password });
  }

  /**
   * Initiates password reset for a user
   * @param email - Email of user requesting password reset
   * @returns Promise resolving to the found User or null
   */
  async forgotPassword(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  isTokenExpired(payload: any): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    return user;
  }
}
