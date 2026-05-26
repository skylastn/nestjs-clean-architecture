import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../../../shared/constant/variable';
import { AuthService } from '../../application/auth_service';
import { AuthController } from '../controller/auth_controller';
import { UserModule } from './user_module';
import { BruteForceModule } from '../../../support/presentation/module/brute_force_module';

@Module({
  imports: [
    UserModule,
    BruteForceModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
