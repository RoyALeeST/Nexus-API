import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentCreateDto } from './dtos/comment-create.dto';
import { AuthGuard } from 'auth/auth.guard';
import { CurrentUser } from '@decorators/current-user.decorator';
import { User } from 'auth/user/user.schema';
import { CommentResponseDto } from './dtos/comment-response.dto';

@Controller('blog/:blogId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createComment(
    @CurrentUser() user: User,
    @Param('blogId') blogId: string,
    @Body() comment: CommentCreateDto,
  ): Promise<CommentResponseDto> {
    const createdComment = await this.commentService.createComment(blogId, {
      ...comment,
      author: user,
    });
    return CommentResponseDto.fromDocument(createdComment);
  }
}
