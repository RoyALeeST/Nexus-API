import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Public } from '@decorators/public.decorator';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('all')
  @Public()
  getPosts() {
    return this.blogService.getPosts();
  }

  @Post('create')
  createPost(@Body() post: any) {
    return this.blogService.createPost(post);
  }

  @Post('update')
  updatePost(@Body() post: any) {
    return this.blogService.updatePost(post.id, post);
  }

  @Post('delete')
  deletePost(@Body() post: any) {
    return this.blogService.deletePost(post.id);
  }

  @Post('getById')
  getPostById(@Body() post: any) {
    return this.blogService.getPostById(post.id);
  }

  @Post('getByAuthor')
  @Public()
  getPostsByAuthor(@Body() post: any) {
    return this.blogService.getPostsByAuthor(post.author);
  }
}
