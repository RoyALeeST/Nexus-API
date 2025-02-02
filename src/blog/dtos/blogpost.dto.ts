import { BlogPost } from "@blog/schemas/BlogPost.schema";
import { User } from "auth/users/user.schema";
import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateBlogPostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  author: User;
}

// Issued with this one
export class UpdateBlogPostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}

export class BlogPostResponseDto {
  /** Unique identifier for the blog post */
  @IsString()
  id: string;

  /** Title of the blog post */
  @IsString()
  title: string;

  /** Content of the blog post */
  @IsString()
  content: string;

  // Author Data
  /** Unique identifier for the author */
  @IsString()
  authorId: string;

  /** Full name of the author */
  @IsString()
  authorName: string;

  /** Username of the author */
  @IsString()
  authorUsername: string;

  static fromDocument(document: BlogPost): BlogPostResponseDto {
    return {
      id: document.publicId,
      title: document.title,
      content: document.content,
      authorId: document.author.publicId,
      authorName: document.author.name,
      authorUsername: document.author.username,
    };
  }
}

export class BlogPostsByAuthorRequestDto {
  @IsString()
  authorPublicId: string;
}
