import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogController } from './blog.controller';
import { BlogPost, BlogPostSchema } from './schemas/BlogPost.schema';
import { BlogService } from './blog.service';
import { UsersModule } from 'auth/users/user.module';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogPost.name, schema: BlogPostSchema },
    ]),
    UsersModule,
    AuthModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService, MongooseModule],
})
export class BlogModule {}
