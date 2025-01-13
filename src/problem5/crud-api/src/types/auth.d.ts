import { User } from '@prisma/client';
import { JWT } from 'next-auth/jwt';

export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

export interface Session {
  userId: number;
  iat: Date;
  updatedAt: Date;
}
