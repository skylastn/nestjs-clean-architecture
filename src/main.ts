import { NestFactory } from '@nestjs/core';
import { AppModule } from './shared/module/app_module';
import { FailedResponseInterceptor } from './shared/interceptor/failed_response_interceptor';
import { SuccessResponseInterceptor } from './shared/interceptor/success_response_interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  app.useGlobalFilters(new FailedResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
