export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// merge namespace ke enum
export namespace UserRole {
  export function fromString(roleString: string): UserRole {
    switch (roleString.toLowerCase()) {
      case UserRole.ADMIN:
        return UserRole.ADMIN;
      case UserRole.USER:
        return UserRole.USER;
      default:
        return UserRole.USER;
    }
  }
}
