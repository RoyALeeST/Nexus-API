import { IsString } from 'class-validator';
import { User } from './user.schema';

export class UserResponseDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  userName: string;

  static fromSchema(user: User) {
    return {
      id: user.publicId,
      email: user.email,
      name: user.name,
      userName: user.username,
    };
  }
}
