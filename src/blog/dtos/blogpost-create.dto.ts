import { IsString } from 'class-validator';
import { User } from 'auth/user/schema/user.schema';

export class CreateBlogPostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  thumbnail: string;

  author: User;
}
