import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Public } from '@decorators/public.decorator';
import { AuthGuard } from './auth.guard';
import { Roles } from '@decorators/roles.decorator';
import { Role } from 'utils/enums/roles.enum';
import { RolesGuard } from './roles.guard';
import { User } from './users/user.schema';
import { CurrentUser } from '@decorators/current-user.decorator';
import { UserResponseDto } from './users/userResponse.dto';
import { AuthRequest } from './interfaces/authRequest.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @Public()
  login(@Body() body: any, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(body, response as any);
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
   * Initiates password reset process for a user
   * @param body - Request body containing email for password reset
   * @returns Object containing success message and reset request data
   */
  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() body: any) {
    try {
      const { email } = body;
      await this.authService.forgotPassword(email);
    } catch (error) {
      throw new BadRequestException('Error sending email');
    }

    return {
      message: 'Password reset email sent',
    };
  }

  @Post('password-reset')
  @UseGuards(AuthGuard)
  passwordReset(@Body() body: AuthRequest) {
    try {
      const user = this.authService.resetPassword(body);
      return {
        message: 'Password reset successful',
      };
    } catch (error) {
      throw new BadRequestException('Error resetting password');
    }
  }

  @Get('self')
  @UseGuards(AuthGuard)
  self(@CurrentUser() user: User) {
    return UserResponseDto.fromSchema(user);
  }
}
