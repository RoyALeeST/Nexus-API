import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BlogService } from './blog.service';
import { Public } from '@decorators/public.decorator';
import { AuthGuard } from 'auth/auth.guard';
import { User } from 'auth/user/user.schema';
import { BlogPostResponseDto } from './dtos/blogpost-response.dto';
import { CreateBlogPostDto } from './dtos/blogpost-create.dto';
import { UpdateBlogPostDto } from './dtos/blogpost-update.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @Public()
  async getPosts(): Promise<BlogPostResponseDto[]> {
    const posts = await this.blogService.getPosts();
    return posts.map(BlogPostResponseDto.fromDocument);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @Req() req: Request & { locals: { user: User } },
    @Body() createPostDto: CreateBlogPostDto,
  ): Promise<BlogPostResponseDto> {
    createPostDto.author = req.locals.user;
    const createdPost = await this.blogService.createPost(createPostDto);
    return BlogPostResponseDto.fromDocument(createdPost);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updatePost(
    @Param('id') id: string,
    @Req() req: Request & { locals: { user: User } },
    @Body() updatePostDto: UpdateBlogPostDto,
  ): Promise<BlogPostResponseDto> {
    const updatedPost = await this.blogService.updatePost(
      id,
      req.locals.user._id,
      updatePostDto,
    );
    return BlogPostResponseDto.fromDocument(updatedPost);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  // TODO: Add middleware to verify if the user making the request is an admin.
  async deletePost(
    @Param('id') id: string,
    @Req() req: Request & { locals: { user: User } },
  ): Promise<void> {
    await this.blogService.deletePost(id, req.locals.user._id);
  }

  @Get(':id')
  @Public()
  async getPostById(@Param('id') id: string): Promise<BlogPostResponseDto> {
    const post = await this.blogService.getPostById(id);
    return BlogPostResponseDto.fromDocument(post);
  }

  @Get('author/:authorPublicId')
  @Public()
  async getPostsByAuthor(
    @Param('authorPublicId') authorPublicId: string,
  ): Promise<BlogPostResponseDto[]> {
    const posts = await this.blogService.getPostsByAuthor(authorPublicId);
    return posts.map(BlogPostResponseDto.fromDocument);
  }
}
