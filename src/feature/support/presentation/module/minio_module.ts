import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestMinioModule } from 'nestjs-minio';
import { MinioService } from '../../application/minio_service';
import { MinioController } from '../controller/minio_controller';

@Module({
  imports: [
    ConfigModule,
    NestMinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isLocal =
          config.get<string>('ENV') === 'local' ||
          config.get<string>('NODE_ENV') === 'local';
        const value = (name: string, localFallback: string): string => {
          const configuredValue = config.get<string>(name);
          if (configuredValue) {
            return configuredValue;
          }
          if (isLocal) {
            return localFallback;
          }
          throw new Error(`${name} is required when MinIO support is enabled`);
        };
        const rawPort =
          config.get<string>('MINIO_PORT') ?? (isLocal ? '9000' : undefined);
        const useSSL = ['true', '1', 'yes'].includes(
          (config.get<string>('MINIO_USE_SSL') ?? 'false').toLowerCase(),
        );

        return {
          endPoint: value('MINIO_ENDPOINT', 'localhost'),
          useSSL,
          accessKey: value('MINIO_ACCESS_KEY', 'minioadmin'),
          secretKey: value('MINIO_SECRET_KEY', 'minioadmin'),
          region: config.get<string>('MINIO_REGION') ?? 'us-east-1',
          pathStyle: true,
          ...(rawPort ? { port: Number(rawPort) } : {}),
        };
      },
    }),
  ],
  providers: [MinioService],
  controllers: [MinioController],
  exports: [MinioService],
})
export class MinioModule {}
