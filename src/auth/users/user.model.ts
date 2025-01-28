import { Role } from 'utils/enums/roles.enum';

export class User {
  id: string;
  publicId: string;
  email: string;
  name: string;
  age: number;
  roles: Role[];
  access_token: string;
  deleted: boolean;

  constructor(id: string, email: string, name: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.roles = [];
  }
}
