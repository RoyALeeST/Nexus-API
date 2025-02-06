import { IsString } from "class-validator";

export class UpdateBlogPostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
