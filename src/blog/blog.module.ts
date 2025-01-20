import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPost } from './models/BlogPost.model';
import { BlogPostSchema } from './schemas/BlogPost.schema';
import { BlogService } from './blog.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogPost.name, schema: BlogPostSchema },
    ]),
  ],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
