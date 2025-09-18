import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../application/user_service';
import { UserResponse } from '../../domain/model/response/user_response';
import { AuthGuard } from '../guard/auth_guard';

@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getAll() {
    return await this.userService.findAll();
  }
  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    return await this.userService.findById(parseInt(id, 10));
  }

  @HttpCode(HttpStatus.OK)
  @Post('update/:id')
  async update(
    @Param('id') id: string,
    @Body() signInDto: Record<string, any>,
  ) {
    const result = await this.userService.update(parseInt(id, 10), {
      name: signInDto.name,
      username: signInDto.username,
      password: signInDto.password,
      role: signInDto.role ?? null,
    });
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('update/self/:id')
  async updateSelf(@Body() signInDto: Record<string, any>) {
    const user: UserResponse | null = this.userService.findMe();
    if (!user || !user.id) {
      throw new Error('User not found');
    }
    const result = await this.userService.update(user!.id!, {
      name: signInDto.name,
      username: signInDto.username,
      password: signInDto.password,
      role: signInDto.role ?? null,
    });
    return result;
  }
}
