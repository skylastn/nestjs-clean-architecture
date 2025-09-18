import { UserRole } from '../enum/user_role';

export class RegisterUserRequest {
  name: string;
  username: string;
  password: string;
  role?: UserRole;
}
