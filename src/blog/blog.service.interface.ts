import { Types } from 'mongoose';
import { CreateBlogPostDto } from './dtos/blogpost-create.dto';
import { UpdateBlogPostDto } from './dtos/blogpost-update.dto';
import { BlogPost } from './schemas/BlogPost.schema';

export interface IBlogService {
  getPosts(): Promise<BlogPost[]>;
  createPost(createPostDto: CreateBlogPostDto): Promise<BlogPost>;
  updatePost(postId: string, userId: Types.ObjectId, updatePostDto: UpdateBlogPostDto): Promise<BlogPost>;
  deletePost(postId: string, userId: Types.ObjectId): Promise<void>;
  getPostById(postId: string): Promise<BlogPost>;
  getPostsByAuthor(authorPublicId: string): Promise<BlogPost[]>;
  getPostsByCategory(category: string): Promise<BlogPost[]>;
}
