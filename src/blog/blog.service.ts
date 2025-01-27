import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost } from './models/BlogPost.model';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>,
  ) {}

  /**
   * Retrieves all blog posts from the database
   * @returns {Promise<BlogPost[]>} Array of all blog posts
   */
  async getPosts(): Promise<BlogPost[]> {
    return this.blogPostModel.find();
  }

  /**
   * Creates a new blog post
   * @param {BlogPost} post - The blog post data to create
   * @returns {Promise<BlogPost>} The created blog post
   */
  async createPost(post: BlogPost): Promise<BlogPost> {
    return this.blogPostModel.create(post);
  }

  /**
   * Updates an existing blog post
   * @param {string} id - ID of the post to update
   * @param {BlogPost} post - Updated blog post data
   * @returns {Promise<BlogPost>} The updated blog post
   */
  async updatePost(id: string, post: BlogPost): Promise<BlogPost> {
    return this.blogPostModel.findByIdAndUpdate(id, post);
  }

  /**
   * Deletes a blog post
   * @param {string} id - ID of the post to delete
   * @returns {Promise<BlogPost>} The deleted blog post
   */
  async deletePost(id: string): Promise<BlogPost> {
    return this.blogPostModel.findByIdAndDelete(id);
  }

  /**
   * Retrieves a blog post by ID
   * @param {string} id - ID of the post to retrieve
   * @returns {Promise<BlogPost>} The requested blog post
   */
  async getPostById(id: string): Promise<BlogPost> {
    return this.blogPostModel.findById(id);
  }

  /**
   * Retrieves all blog posts by a specific author
   * @param {string} author - Author name to filter by
   * @returns {Promise<BlogPost[]>} Array of matching blog posts
   */
  async getPostsByAuthor(author: string): Promise<BlogPost[]> {
    return this.blogPostModel.find({ author });
  }

  /**
   * Retrieves all blog posts in a specific category
   * @param {string} category - Category to filter by
   * @returns {Promise<BlogPost[]>} Array of matching blog posts
   */
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    return await this.blogPostModel.find({ category });
  }
}
