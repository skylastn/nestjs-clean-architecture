import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../../application/user_service';
import { UserEntity } from '../../domain/model/entities/user_entity';
import { UserRepositoryImpl } from '../../infrastructure/persistence/user_repository_impl';
import { USER_REPOSITORY } from '../../domain/repository/user_repository';
import { CurrentUserProvider } from '../../../../shared/provider/current_user_provider';
import { UserController } from '../controller/user_controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserService,
    CurrentUserProvider,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard, // ⬅️ otomatis jalan di UserModule
    // },
    {
      provide: USER_REPOSITORY, // token (interface)
      useClass: UserRepositoryImpl, // implementasi
    },
  ],
  exports: [UserService],
  controllers: [UserController], // aktifkan kalau sudah bikin controller
})
export class UserModule {}
