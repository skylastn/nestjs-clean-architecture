import { AuthService } from '../../application/auth_service';
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() signInDto: Record<string, any>) {
    return this.authService.login(signInDto.username, signInDto.password);
  }
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() signInDto: Record<string, any>) {
    const result = await this.authService.register({
      name: signInDto.name,
      username: signInDto.username,
      password: signInDto.password,
      role: signInDto.role ?? null,
    });
    return result;
  }
}
