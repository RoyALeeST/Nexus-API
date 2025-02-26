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
