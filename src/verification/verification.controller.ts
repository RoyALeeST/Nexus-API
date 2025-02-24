import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  BadRequestException,
  Res,
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
  async verifyCode(
    @Body() codeVerificationData: CodeVerification,
    @Res({ passthrough: true }) response: Response,
  ) {
    let result;
    switch (codeVerificationData.verificationType) {
      case VerificationTypes.EMAIL_VERIFICATION:
        result =
          await this.verificationService.verifyEmailCode(codeVerificationData);
        break;
      case VerificationTypes.PASSWORD_RESET:
        result = await this.verificationService.verifyPasswordResetCode(
          codeVerificationData,
          response as any,
        );
        break;
      default:
        throw new BadRequestException('Invalid verification type');
    }
    return result;
  }
}
