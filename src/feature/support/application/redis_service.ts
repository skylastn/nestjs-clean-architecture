import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;

  constructor(private readonly config: ConfigService) {
    this.client = createClient({
      url: this.config.get<string>('REDIS_URL') ?? 'redis://localhost:6379',
      password: this.config.get<string>('REDIS_PASSWORD'),
    });

    this.client.on('error', (error: Error) => {
      console.error('Redis error:', error.message);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  async set(key: string, value: string, ttlInSeconds?: number): Promise<void> {
    if (ttlInSeconds !== undefined) {
      await this.client.set(key, value, { EX: ttlInSeconds });
      return;
    }

    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async expire(key: string, ttlInSeconds: number): Promise<boolean> {
    return (await this.client.expire(key, ttlInSeconds)) === 1;
  }

  async incr(key: string, ttlInSeconds?: number): Promise<number> {
    const value = await this.client.incr(key);

    if (value === 1 && ttlInSeconds !== undefined) {
      await this.client.expire(key, ttlInSeconds);
    }

    return value;
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }
}
