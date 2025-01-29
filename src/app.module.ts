import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationMiddleware } from './auth/auth.middleware';
import { BlogController } from 'blog/blog.controller';
import { BlogModule } from 'blog/blog.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://rodrigovillalobossan:nRfMhagrWicdZyRf@mb-dev.gvanu.mongodb.net/?retryWrites=true&w=majority&appName=MB-DEV',
    ),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
    BlogModule,
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
        { path: 'blog/get-post-by-id', method: RequestMethod.POST },
        { path: 'blog/get-posts-by-author', method: RequestMethod.POST },
      )
      .forRoutes(AuthController, BlogController);
  }
}
