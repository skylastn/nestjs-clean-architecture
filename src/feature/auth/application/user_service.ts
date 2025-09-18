import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../domain/model/entities/user_entity';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../domain/repository/user_repository';
import { RegisterUserRequest } from '../domain/model/request/register_user_request';
import { UserResponse } from '../domain/model/response/user_response';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private usersRepository: UserRepository,
  ) {}

  findMe(): UserResponse | null {
    return this.usersRepository.findMe();
  }

  async findAll(): Promise<UserResponse[]> {
    const result = await this.usersRepository.findAll();
    return UserResponse.convertListFromEntities(result);
  }

  async findById(id: number): Promise<UserResponse | null> {
    const result = await this.usersRepository.findById(id);
    return UserResponse.convertFromEntity(result);
  }
  async findByUsername(username: string): Promise<UserResponse | null> {
    const result = await this.usersRepository.findByUsername(username);
    return UserResponse.convertFromEntity(result);
  }

  async create(data: RegisterUserRequest): Promise<UserResponse | null> {
    const result = await this.usersRepository.create(data);
    return UserResponse.convertFromEntity(result);
  }

  async update(
    id: number,
    data: RegisterUserRequest,
  ): Promise<UserResponse | null> {
    const result = await this.usersRepository.update(data, id);
    return UserResponse.convertFromEntity(result);
  }

  async removeById(id: number): Promise<void> {
    return await this.usersRepository.removeById(id);
  }
}
