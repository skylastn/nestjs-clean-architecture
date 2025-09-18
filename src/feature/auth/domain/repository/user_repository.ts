import { UserEntity } from '../model/entities/user_entity';
import { RegisterUserRequest } from '../model/request/register_user_request';
import { UserResponse } from '../model/response/user_response';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export interface UserRepository {
  findMe(): UserResponse | null;
  findAll(): Promise<UserEntity[]>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  create(data: RegisterUserRequest): Promise<UserEntity | null>;
  update(data: RegisterUserRequest, id: number): Promise<UserEntity | null>;
  removeById(id: number): Promise<void>;
}
