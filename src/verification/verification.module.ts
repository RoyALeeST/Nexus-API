import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'auth/users/user.schema';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { UserService } from 'auth/users/users.service';
import { UsersModule } from 'auth/users/user.module';

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
