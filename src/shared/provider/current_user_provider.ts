import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserResponse } from '../../feature/auth/domain/model/response/user_response';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserProvider {
  constructor(@Inject(REQUEST) private request: Request) {}

  get user(): UserResponse | null {
    return this.request['user'];
  }
}
