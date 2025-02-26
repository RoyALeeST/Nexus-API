import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'auth/user/user.schema';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { UserService } from 'auth/user/service/user.service';
import { UsersModule } from 'auth/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    UsersModule,
  ],
  providers: [VerificationService, UserService],
  exports: [VerificationService],
  controllers: [VerificationController],
})
export class VerificationModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'auth/users/user.schema';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { UserService } from 'auth/users/users.service';
import { UsersModule } from 'auth/users/user.module';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'mail/mail.service';
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
