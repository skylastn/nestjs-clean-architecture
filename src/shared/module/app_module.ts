import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from '../../feature/auth/presentation/module/user_module';
import { DatabaseModule } from './database_module';
import { AuthModule } from '../../feature/auth/presentation/module/auth_module';
import { AuthMiddleware } from '../../feature/auth/presentation/middleware/auth_middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionInterceptor } from '../interceptor/transaction_interceptor';
@Module({
  imports: [DatabaseModule, UserModule, AuthModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        { path: 'cats/:id', method: RequestMethod.ALL },
      )
      .forRoutes(
        { path: 'user', method: RequestMethod.ALL },
        { path: 'user/:id', method: RequestMethod.ALL },
      );
  }
}
