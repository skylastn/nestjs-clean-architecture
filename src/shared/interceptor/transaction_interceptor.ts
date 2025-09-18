// transaction.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Observable, lastValueFrom, from } from 'rxjs';
import { entityManagerStorage } from '../provider/transaction_provider';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return from(
      entityManagerStorage.run(queryRunner.manager, async () => {
        try {
          // jalankan request (controller/service)
          const result = await lastValueFrom(next.handle());

          // kalau sukses → commit
          if (queryRunner.isTransactionActive) {
            await queryRunner.commitTransaction();
          }

          return result;
        } catch (err) {
          // kalau gagal → rollback
          if (queryRunner.isTransactionActive) {
            await queryRunner.rollbackTransaction();
          }
          throw err;
        } finally {
          // apapun hasilnya → release sekali aja
          if (!queryRunner.isReleased) {
            await queryRunner.release();
          }
        }
      }),
    );
  }
}
