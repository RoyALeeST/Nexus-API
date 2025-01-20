import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Public } from '@decorators/public.decorator';
import { AuthGuard } from './auth.guard';
import { Roles } from '@decorators/roles.decorator';
import { Role } from 'utils/enums/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user with their credentials
   * @param body - Request body containing login credentials
   * @returns Object containing success message and user data
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: any) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Post('profile')
  getProfile(@Body() body: Record<string, any>) {
    return body;
  }

  /**
   * Registers a new user account
   * @param body - Request body containing registration details
   * @returns Object containing success message and registered user data
   */
  @Post('register')
  @Public()
  async register(@Body() body: any) {
    const user = await this.authService.register(body);
    return {
      message: 'Register successful',
      data: user,
    };
  }

  /**
   * Logs out a currently authenticated user
   * @param body - Request body containing logout details
   * @returns Object containing success message and logout data
   */
  @Post('logout')
  logout(@Body() body: any) {
    return {
      message: 'Logout successful',
      data: body,
    };
  }

  /**
   * Initiates password reset process for a user
   * @param body - Request body containing email for password reset
   * @returns Object containing success message and reset request data
   */
  @Post('forgot-password')
  forgotPassword(@Body() body: any) {
    return {
      message: 'Forgot password successful',
      data: body,
    };
  }
}
