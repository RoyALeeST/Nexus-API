import { Role } from 'utils/enums/roles.enum';

export class User {
  id: string;
  email: string;
  name: string;
  age: number;
  roles: Role[];
  access_token: string;

  constructor(id: string, email: string, name: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.roles = [];
  }
}
