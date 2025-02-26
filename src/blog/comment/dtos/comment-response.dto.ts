import { IsString, IsDate } from 'class-validator';
import { Comment } from '../schemas/comment.schema';

export class CommentResponseDto {
  @IsString()
  id: string;

  @IsString()
  content: string;

  @IsString()
  authorId: string;

  @IsString()
  authorName: string;

  @IsString()
  authorUsername: string;

  @IsDate()
  creationDate: Date;

  static fromDocument(document: Comment): CommentResponseDto {
    return {
      id: document.userId,
      content: document.content,
      authorId: document.author.userId,
      authorName: document.author.name,
      authorUsername: document.author.username,
      creationDate: document.creationDate,
    };
  }
}
