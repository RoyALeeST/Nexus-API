import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPost, BlogPostSchema } from './schemas/BlogPost.schema';
import { BlogService } from './blog.service';
import { User, UserSchema } from 'auth/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogPost.name, schema: BlogPostSchema },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
