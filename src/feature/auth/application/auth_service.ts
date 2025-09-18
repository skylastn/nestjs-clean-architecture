import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user_service';
import { EncryptExt } from '../../../shared/utils/extension/encrypt_ext';
import { RegisterUserRequest } from '../domain/model/request/register_user_request';
import { UserEntity } from '../domain/model/entities/user_entity';
import { UserResponse } from '../domain/model/response/user_response';
import { jwtConstants } from '../../../shared/constant/variable';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string; user: UserResponse }> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    if (!(await EncryptExt.comparePassword(password, user.password ?? ''))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: await this.jwtService.signAsync(user.toMap, {
        secret: jwtConstants.secret,
        // expiresIn: '1h',
      }),
      user: user,
    };
  }

  async register(
    data: RegisterUserRequest,
  ): Promise<{ access_token: string; user: UserResponse }> {
    const find = await this.usersService.findByUsername(data.username);
    if (find) {
      throw new NotFoundException('User Already Exist');
    }
    const user = await this.usersService.create(data);
    if (!user) {
      throw new BadGatewayException('Error Creating User');
    }
    return {
      access_token: await this.jwtService.signAsync(user.toMap, {
        secret: jwtConstants.secret,
        // expiresIn: '1h',
      }),
      user: user,
    };
  }
}
