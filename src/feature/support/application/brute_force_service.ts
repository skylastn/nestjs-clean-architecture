import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis_service';

@Injectable()
export class BruteForceService {
  private readonly attemptTtlSeconds: number;
  private readonly blockTtlSeconds: number;
  private readonly maxIpAttempts: number;
  private readonly maxUserAttempts: number;
  private readonly maxComboAttempts: number;

  constructor(
    private readonly redisService: RedisService,
    config: ConfigService,
  ) {
    this.attemptTtlSeconds = this.readNumber(
      config,
      'BRUTE_FORCE_ATTEMPT_TTL_SECONDS',
      900,
    );
    this.blockTtlSeconds = this.readNumber(
      config,
      'BRUTE_FORCE_BLOCK_TTL_SECONDS',
      1800,
    );
    this.maxIpAttempts = this.readNumber(
      config,
      'BRUTE_FORCE_MAX_IP_ATTEMPTS',
      20,
    );
    this.maxUserAttempts = this.readNumber(
      config,
      'BRUTE_FORCE_MAX_USER_ATTEMPTS',
      10,
    );
    this.maxComboAttempts = this.readNumber(
      config,
      'BRUTE_FORCE_MAX_COMBO_ATTEMPTS',
      5,
    );
  }

  async validate(ip: string, username: string): Promise<void> {
    const [ipBlocked, comboBlocked] = await Promise.all([
      this.redisService.exists(this.ipBlockKey(ip)),
      this.redisService.exists(this.comboBlockKey(ip, username)),
    ]);

    if (ipBlocked || comboBlocked) {
      throw new UnauthorizedException(
        'Too many failed attempts. Please try again later.',
      );
    }
  }

  async registerFailure(ip: string, username: string): Promise<void> {
    const [ipAttempts, userAttempts, comboAttempts] = await Promise.all([
      this.redisService.incr(this.ipFailKey(ip), this.attemptTtlSeconds),
      this.redisService.incr(
        this.userFailKey(username),
        this.attemptTtlSeconds,
      ),
      this.redisService.incr(
        this.comboFailKey(ip, username),
        this.attemptTtlSeconds,
      ),
    ]);

    const blocks: Promise<void>[] = [];
    if (ipAttempts >= this.maxIpAttempts) {
      blocks.push(
        this.redisService.set(this.ipBlockKey(ip), '1', this.blockTtlSeconds),
      );
    }

    if (
      comboAttempts >= this.maxComboAttempts ||
      userAttempts >= this.maxUserAttempts
    ) {
      blocks.push(
        this.redisService.set(
          this.comboBlockKey(ip, username),
          '1',
          this.blockTtlSeconds,
        ),
      );
    }

    await Promise.all(blocks);
  }

  async clear(ip: string, username: string): Promise<void> {
    await Promise.all([
      this.redisService.del(this.ipFailKey(ip)),
      this.redisService.del(this.userFailKey(username)),
      this.redisService.del(this.comboFailKey(ip, username)),
      this.redisService.del(this.comboBlockKey(ip, username)),
    ]);
  }

  private normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }

  private ipFailKey(ip: string): string {
    return `bf:login:ip:${ip}`;
  }

  private userFailKey(username: string): string {
    return `bf:login:user:${this.normalizeUsername(username)}`;
  }

  private comboFailKey(ip: string, username: string): string {
    return `bf:login:combo:${ip}:${this.normalizeUsername(username)}`;
  }

  private ipBlockKey(ip: string): string {
    return `bf:block:ip:${ip}`;
  }

  private comboBlockKey(ip: string, username: string): string {
    return `bf:block:combo:${ip}:${this.normalizeUsername(username)}`;
  }

  private readNumber(
    config: ConfigService,
    name: string,
    fallback: number,
  ): number {
    const value = Number(config.get<string>(name));
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }
}
