import { AuthService } from '../../application/auth_service';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { RegisterUserRequest } from '../../domain/model/request/register_user_request';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private getClientIp(request: Request): string {
    return request.ips.length ? request.ips[0] : (request.ip ?? 'unknown-ip');
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() signInDto: Record<string, unknown>, @Req() request: Request) {
    if (
      typeof signInDto.username !== 'string' ||
      typeof signInDto.password !== 'string' ||
      signInDto.username.trim() === '' ||
      signInDto.password === ''
    ) {
      throw new BadRequestException('Username and password are required');
    }

    return this.authService.login(
      signInDto.username,
      signInDto.password,
      this.getClientIp(request),
    );
  }
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() request: RegisterUserRequest) {
    return this.authService.register(request);
  }
}
