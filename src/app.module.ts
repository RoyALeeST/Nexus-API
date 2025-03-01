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
import { BusinessModule } from 'business/module/business.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { CommentController } from '@blog/comment/comment.controller';
import { CommentModule } from '@blog/comment/comment.module';
import { VerificationController } from './verification/verification.controller';
import { VerificationService } from './verification/verification.service';
import { VerificationModule } from './verification/verification.module';
import { UsersModule } from 'auth/user/module/user.module';
import { ProductModule } from './product/module/product.module';
import { AIInsightModule } from './AI/module/ai.module';
import { InventoryModule } from './inventory/module/inventory.module';
import { BusinessController } from './business/controller/business.controller';
import { ProductController } from './product/controller/productController';
import { InventoryController } from './inventory/controller/inventory.controller';
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
    BusinessModule,
    CommentModule,
    UsersModule,
    VerificationModule,
    ProductModule,
    AIInsightModule,
    InventoryModule,
  ],
  controllers: [
    AppController,
    AuthController,
    BlogController,
    VerificationController,
  ],
  providers: [AppService, VerificationService],
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
        { path: 'blog/author/:authoruserId', method: RequestMethod.GET },
        { path: 'verification/code', method: RequestMethod.POST },
      )
      .forRoutes(
        AuthController,
        BlogController,
        CommentController,
        VerificationController,
        BusinessController,
        ProductController,
        InventoryController,
      );
  }
}
