import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req)?.replace('Bearer ', '');
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
        if (this.authService.isTokenExpired(payload)) {
          throw new UnauthorizedException('Token Expirado');
        }
        const user = await this.authService.findUserByEmail(payload.email);
        if (!user) {
          throw new UnauthorizedException('Usuario no encontrado');
        }
        req.locals = { ...req.locals, user };
        next();
      } catch (error) {
        console.log(error);
        throw new UnauthorizedException('Autorizacion Invalida', error.message);
      }
    } else {
      throw new UnauthorizedException(
        'Autorizacion Invalida',
        'Token inexistente',
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const { authorization }: any = request.headers;
    return authorization;
  }
}
