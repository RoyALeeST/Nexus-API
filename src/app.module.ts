import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthenticationMiddleware } from 'auth/auth.middleware';
import { BlogController } from 'blog/blog.controller';
import { BlogModule } from 'blog/blog.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { CommentController } from '@blog/comment/comment.controller';
import { CommentModule } from '@blog/comment/comment.module';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),

    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    BlogModule,
    CommentModule,
  ],
  controllers: [AppController, AuthController, BlogController],
  providers: [AppService],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login-cookie', method: RequestMethod.POST },
        { path: 'blog', method: RequestMethod.GET },
        { path: 'blog/:id', method: RequestMethod.GET },
        { path: 'blog/author/:authorPublicId', method: RequestMethod.GET },
      )
      .forRoutes(AuthController, BlogController, CommentController);

  }
}
