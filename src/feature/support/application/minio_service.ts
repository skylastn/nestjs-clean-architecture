import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BucketItem, BucketItemStat, Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { MinioResponse } from '../domain/model/response/minio_response';

@Injectable()
export class MinioService {
  private readonly bucket: string;
  private readonly publicBaseUrl?: string;
  private readonly publicMinioClient: Client;

  constructor(
    @Inject(MINIO_CONNECTION)
    private readonly minioClient: Client,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.storageConfig(
      'MINIO_BUCKET',
      'nestjs-clean-architecture',
    );
    this.publicBaseUrl = this.config.get<string>('MINIO_URL');
    this.publicMinioClient = new Client({
      endPoint:
        this.config.get<string>('MINIO_PUBLIC_ENDPOINT') ??
        this.storageConfig('MINIO_ENDPOINT', 'localhost'),
      useSSL: this.parseBoolean(
        this.config.get<string>('MINIO_PUBLIC_USE_SSL'),
        this.parseBoolean(this.config.get<string>('MINIO_USE_SSL'), false),
      ),
      accessKey:
        this.config.get<string>('MINIO_PUBLIC_ACCESS_KEY') ??
        this.storageConfig('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey:
        this.config.get<string>('MINIO_PUBLIC_SECRET_KEY') ??
        this.storageConfig('MINIO_SECRET_KEY', 'minioadmin'),
      region:
        this.config.get<string>('MINIO_PUBLIC_REGION') ??
        this.config.get<string>('MINIO_REGION') ??
        'us-east-1',
      pathStyle: true,
      ...this.portConfig('MINIO_PUBLIC_PORT', 'MINIO_PORT'),
    });
  }

  async getPresignedUploadUrl(objectKey: string): Promise<MinioResponse> {
    const key = this.normalizeObjectKey(objectKey);
    const url = await this.publicMinioClient.presignedPutObject(
      this.bucket,
      key,
      60 * 5,
    );
    return new MinioResponse(key, url);
  }

  async getPresignedViewUrl(
    objectKey: string,
    expiresInSeconds = 60 * 5,
  ): Promise<MinioResponse> {
    const key = this.normalizeObjectKey(objectKey);
    const url = await this.publicMinioClient.presignedGetObject(
      this.bucket,
      key,
      expiresInSeconds,
    );
    return new MinioResponse(key, url);
  }

  async getViewUrl(objectKey: string): Promise<MinioResponse> {
    const key = this.normalizeObjectKey(objectKey);
    if (this.publicBaseUrl) {
      return new MinioResponse(
        key,
        `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`,
      );
    }

    return this.getPresignedViewUrl(key);
  }

  async uploadFile(
    objectKey: string,
    filePath: string,
    contentType?: string,
  ): Promise<void> {
    await this.minioClient.fPutObject(
      this.bucket,
      this.normalizeObjectKey(objectKey),
      filePath,
      contentType ? { 'Content-Type': contentType } : undefined,
    );
  }

  async downloadFile(objectKey: string, filePath: string): Promise<void> {
    await this.minioClient.fGetObject(
      this.bucket,
      this.normalizeObjectKey(objectKey),
      filePath,
    );
  }

  async removeObject(objectKey: string): Promise<void> {
    await this.minioClient.removeObject(
      this.bucket,
      this.normalizeObjectKey(objectKey),
    );
  }

  async removePrefix(objectPrefix: string): Promise<void> {
    const keys: string[] = [];
    const stream = this.minioClient.listObjectsV2(
      this.bucket,
      this.normalizeObjectKey(objectPrefix),
      true,
    );

    await new Promise<void>((resolve, reject) => {
      stream.on('data', (item: BucketItem) => {
        if (item.name) {
          keys.push(item.name);
        }
      });
      stream.on('error', reject);
      stream.on('end', resolve);
    });

    if (keys.length > 0) {
      await this.minioClient.removeObjects(this.bucket, keys);
    }
  }

  async statObject(objectKey: string): Promise<BucketItemStat> {
    return this.minioClient.statObject(
      this.bucket,
      this.normalizeObjectKey(objectKey),
    );
  }

  normalizeObjectKey(objectKey: string): string {
    return objectKey.replace(/^\/+/, '').replace(/^uploads\//, '');
  }

  private storageConfig(name: string, localFallback: string): string {
    const value = this.config.get<string>(name);
    if (value) {
      return value;
    }

    if (
      this.config.get<string>('ENV') === 'local' ||
      this.config.get<string>('NODE_ENV') === 'local'
    ) {
      return localFallback;
    }

    throw new Error(`${name} is required when MinIO support is enabled`);
  }

  private portConfig(
    publicPortName: string,
    internalPortName: string,
  ): { port?: number } {
    const hasPublicEndpoint = this.config.get<string>('MINIO_PUBLIC_ENDPOINT');
    const rawPort = hasPublicEndpoint
      ? this.config.get<string>(publicPortName)
      : (this.config.get<string>(internalPortName) ??
        (this.config.get<string>('ENV') === 'local' ? '9000' : undefined));
    return rawPort ? { port: Number(rawPort) } : {};
  }

  private parseBoolean(value: string | undefined, fallback: boolean): boolean {
    return value === undefined
      ? fallback
      : ['true', '1', 'yes'].includes(value.toLowerCase());
  }
}
