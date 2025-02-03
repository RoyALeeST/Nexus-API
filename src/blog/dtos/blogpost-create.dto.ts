import { IsString } from "class-validator";
import { User } from "auth/users/user.schema";

export class CreateBlogPostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  author: User;
}
