import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Public } from '@decorators/public.decorator';
import { AuthGuard } from 'auth/auth.guard';
import { BlogPost } from './models/BlogPost.model';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('all')
  @Public()
  getPosts() {
    return this.blogService.getPosts();
  }

  @Post('create-post')
  @UseGuards(AuthGuard)
  createPost(@Body() post: BlogPost) {
    return this.blogService.createPost(post);
  }

  @Post('update-post')
  @UseGuards(AuthGuard)
  updatePost(@Body() post: BlogPost) {
    return this.blogService.updatePost(post.publicId, post);
  }

  @Post('delete-post')
  @UseGuards(AuthGuard)
  deletePost(@Body() post: BlogPost) {
    return this.blogService.deletePost(post.publicId);
  }

  @Post('get-post-by-id')
  @Public()
  async getPostById(@Body() post: BlogPost) {
    const postInDb = await this.blogService.getPostById(post.publicId);
    if (!postInDb) {
      throw new NotFoundException('Post not found');
    }
    return postInDb;
  }

  @Post('get-posts-by-author')
  @Public()
  getPostsByAuthor(@Body() post: BlogPost) {
    return this.blogService.getPostsByAuthor(post.author);
  }
}
