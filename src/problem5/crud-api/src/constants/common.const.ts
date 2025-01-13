export enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending'
}

export enum TokenType {
  REFRESH = 'refresh',
  ACCESS = 'access',
  RESET_PASSWORD = 'reset-password',
  VERIFY_EMAIL = 'verify-email',
}
