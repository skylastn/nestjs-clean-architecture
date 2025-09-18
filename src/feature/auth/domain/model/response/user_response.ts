import { UserEntity } from '../entities/user_entity';
import { UserRole } from '../enum/user_role';

export class UserResponse {
  id: number | null;
  name: string | null;
  username: string | null;
  password: string | null;
  role: UserRole | null;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    id: number | null,
    name: string | null,
    username: string | null,
    password: string | null,
    role: UserRole | null,
    isActive: boolean | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static convertFromEntity(user: UserEntity | null): UserResponse | null {
    if (!user) return null;
    return new UserResponse(
      user.id,
      user.name,
      user.username,
      user.password,
      UserRole.fromString(user.role),
      user.isActive,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    );
  }

  static convertListFromEntities(users: UserEntity[]): UserResponse[] {
    return users.map((user) => this.convertFromEntity(user)!);
  }

  get toMap(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      password: this.password,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  static fromMap(user: any): UserResponse {
    return new UserResponse(
      user.id,
      user.name,
      user.username,
      user.password,
      UserRole.fromString(user.role),
      user.isActive,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    );
  }
}
