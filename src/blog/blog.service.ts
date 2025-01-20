import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost } from './models/BlogPost.model';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>,
  ) {}

  async getPosts(): Promise<BlogPost[]> {
    return this.blogPostModel.find();
  }

  async createPost(post: BlogPost): Promise<BlogPost> {
    return this.blogPostModel.create(post);
  }

  async updatePost(id: string, post: BlogPost): Promise<BlogPost> {
    return this.blogPostModel.findByIdAndUpdate(id, post);
  }

  async deletePost(id: string): Promise<BlogPost> {
    return this.blogPostModel.findByIdAndDelete(id);
  }

  async getPostById(id: string): Promise<BlogPost> {
    return this.blogPostModel.findById(id);
  }

  async getPostsByAuthor(author: string): Promise<BlogPost[]> {
    return this.blogPostModel.find({ author });
  }
}
