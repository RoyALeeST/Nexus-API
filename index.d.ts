import { Express } from 'express-serve-static-core'; // DO NOT REMOVE THIS LINE

interface TokenData {
  iat: string;
  exp: string;
  email: string;
  roles: string[];
}
interface Locals {
  user: User;
}
declare module 'express-serve-static-core' {
  interface Request {
    tokenData: TokenData;
    locals: Locals;
  }
}
