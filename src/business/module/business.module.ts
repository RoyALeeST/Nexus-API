import { Module } from '@nestjs/common';
import { BusinessService } from '../service/business.service';
import { BusinessController } from '../controller/business.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Business, BusinessSchema } from '../schema/business.schema';
import { User, UserSchema } from 'auth/user/schema/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [BusinessService],
  controllers: [BusinessController],
  exports: [BusinessService],
})
export class BusinessModule {}
