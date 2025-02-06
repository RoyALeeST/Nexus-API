import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { Public } from 'utils';
import { VerificationService } from './verification.service';
import { CodeVerification } from './interfaces/codeVerification.interface';
import { CurrentUser } from 'utils/decorators/current-user.decorator';
import { User } from 'auth/users/user.schema';
import { VerificationTypes } from 'utils/enums/verificationType.enum';
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('code')
  @Public()
  async verifyCode(@Body() codeVerificationData: CodeVerification) {
    switch (codeVerificationData.verificationType) {
      case VerificationTypes.EMAIL_VERIFICATION:
        const result =
          await this.verificationService.verifyCode(codeVerificationData);
        return result;
      case VerificationTypes.PASSWORD_RESET:
        console.log('password Reset');
        break;
      default:
        throw new BadRequestException('Invalid verification type');
    }
  }
}
