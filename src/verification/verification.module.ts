import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'auth/auth.service';
import { UserService } from 'auth/user/service/user.service';
import { UserSchema } from 'auth/user/user.schema';
import { UsersModule } from 'auth/user/user.module';
import { MailService } from 'mail/mail.service';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    UsersModule,
  ],
  providers: [
    VerificationService,
    UserService,
    JwtService,
    AuthService,
    ConfigService,
    MailService,
  ],
  exports: [VerificationService],
  controllers: [VerificationController],
})
export class VerificationModule {}
