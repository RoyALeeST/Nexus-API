import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BlogPost } from './schemas/BlogPost.schema';
import { CreateBlogPostDto } from './dtos/blogpost-create.dto';
import { IBlogService } from './blog.service.interface';
import { UpdateBlogPostDto } from './dtos/blogpost-update.dto';
import { User } from 'auth/user/schema/user.schema';

@Injectable()
export class BlogService implements IBlogService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * Retrieves all blog posts from the database
   * @returns {Promise<BlogPost[]>} Array of all blog posts
   */
  async getPosts(): Promise<BlogPost[]> {
    try {
      return await this.blogPostModel
        .find({ deleted: false })
        .populate('author', 'userId name username')
        .sort({ creationDate: -1 })
        .exec();
    } catch (error) {
      throw new BadRequestException('Error al obtener los posts');
    }
  }

  /**
   * Creates a new blog post
   * @param {CreateBlogPostDto} createPostDto - Dto for the post to create
   * @returns {Promise<BlogPost>} The created blog post
   */
  async createPost(createPostDto: CreateBlogPostDto): Promise<BlogPost> {
    try {
      const newPost = await this.blogPostModel.create(createPostDto);
      return newPost.populate('author', 'userId name username');
    } catch (error) {
      throw new BadRequestException('Error al crear el post');
    }
  }

  /**
   * Updates an existing blog post
   * @param {string} id - ID of the post to update
   * @param {Types.ObjectId} userId - ID of the user updating the post
   * @param {UpdateBlogPostDto} updatePostDto - Update dto for the post
   * @returns {Promise<BlogPost>} The updated blog post
   */
  async updatePost(
    id: string,
    userId: Types.ObjectId,
    updatePostDto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    try {
      const post = await this.blogPostModel
        .findOne({ userId: id })
        .populate('author', '_id');

      if (!post) {
        throw new NotFoundException('El post no fue encontrado');
      }

      if (!post.author._id.equals(userId)) {
        throw new ForbiddenException(
          'No tienes permisos para actualizar este post',
        );
      }

      const updatedPost = await this.blogPostModel
        .findOneAndUpdate(
          { userId: id },
          {
            $set: {
              title: updatePostDto.title,
              content: updatePostDto.content,
            },
          },
          { new: true },
        )
        .populate('author', 'userId name username');

      if (!updatedPost) {
        throw new NotFoundException('El post no fue actualizado');
      }

      return updatedPost;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new BadRequestException('Error al actualizar el post');
    }
  }

  /**
   * Deletes a blog post
   * @param {string} id - ID of the post to delete
   * @returns {Promise<void>} A void promise that completes when the post is deleted
   */
  async deletePost(id: string, userId: Types.ObjectId): Promise<void> {
    try {
      const postToDelete = await this.blogPostModel
        .findOne({ userId: id, deleted: false })
        .populate('author', '_id')
        .exec();

      if (!userId.equals(postToDelete.author._id)) {
        throw new ForbiddenException(
          'No tienes permisos para eliminar este post',
        );
      }

      const deleteResult = await this.blogPostModel
        .findOneAndUpdate(
          { userId: id, deleted: false },
          { $set: { deleted: true } },
        )
        .exec();

      if (!deleteResult) {
        throw new NotFoundException(
          'El post no fue encontrado o ya fue eliminado',
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el post');
    }
  }

  /**
   * Retrieves a blog post by ID
   * @param {string} id - Public ID of the post to retrieve
   * @returns {Promise<BlogPost>} The requested blog post
   */
  async getPostById(id: string): Promise<BlogPost> {
    try {
      const post = await this.blogPostModel
        .findOne({ userId: id, deleted: false })
        .populate('author', 'userId name username')
        .populate('comments.author', 'userId name username')
        .exec();

      if (!post) {
        throw new NotFoundException('El post no fue encontrado');
      }

      return post;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el post');
    }
  }

  /**
   * Retrieves all blog posts by a specific author
   * @param {string} authoruserId - Author public ID to filter by
   * @returns {Promise<BlogPost[]>} Array of matching blog posts
   */
  async getPostsByAuthor(authoruserId: string): Promise<BlogPost[]> {
    try {
      const author = await this.userModel.findOne({ userId: authoruserId });

      const posts = await this.blogPostModel
        .find({
          author: author._id,
          deleted: false,
        })
        .populate('author', 'userId name username')
        .sort({ creationDate: -1 })
        .exec();

      return posts;
    } catch (error) {
      throw new BadRequestException('Error al obtener los posts del autor');
    }
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
