import { Module } from '@nestjs/common';
import { BruteForceService } from '../../application/brute_force_service';
import { RedisModule } from './redis_module';

@Module({
  imports: [RedisModule],
  providers: [BruteForceService],
  exports: [BruteForceService],
})
export class BruteForceModule {}
