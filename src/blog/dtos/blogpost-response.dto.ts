import { BlogPost } from "@blog/schemas/BlogPost.schema";
import { IsString } from "class-validator";

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

  /** Thumbnail of the blog post */
  @IsString()
  thumbnail: string;

  /** Creation date of the blog post */
  @IsString()
  creationDate: string;

  static fromDocument(document: BlogPost): BlogPostResponseDto {
    return {
      id: document.publicId,
      title: document.title,
      content: document.content,
      authorId: document.author.publicId,
      authorName: document.author.name,
      authorUsername: document.author.username,
      thumbnail: document.thumbnail,
      creationDate: document.creationDate,
    };
  }
}

