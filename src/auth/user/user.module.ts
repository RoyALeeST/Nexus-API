import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { User } from './user.schema';
import { UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UsersModule {}
