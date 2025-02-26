import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'auth/auth.module';
import { BlogModule } from '../blog.module';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { UsersModule } from 'auth/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    AuthModule,
    BlogModule,
    UsersModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService, MongooseModule],
})
export class CommentModule {}
