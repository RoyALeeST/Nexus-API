import { User } from 'auth/user/user.schema';
import { IsString } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  content: string;

  author: User;
}
