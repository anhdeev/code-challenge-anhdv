import { User } from '@prisma/client';
import { Session } from '../types/auth';
import { TokenResponse } from '../types/auth';

export const createUserResponse = (
  users?: User[],
  sessions?: Session[]
): Record<string, unknown>[] => {
  if (!users) return [];

  return users.map((user) => {
    const jsonUser = JSON.parse(JSON.stringify(user));
    const userData: Record<string, unknown> = {};

    Object.keys(jsonUser).forEach((key) => {
      if (key !== 'password') {
        userData[key] = jsonUser[key];
      }
    });

    userData['lastSeen'] = sessions?.find((s) => s.userId === user.id)?.iat?.getTime();
    return userData;
  });
};

export const createUserCredentialResponse = (
  user: Omit<User, 'password' | 'createdAt' | 'updatedAt'>,
  accessToken?: TokenResponse,
  refreshToken?: TokenResponse
) => {
  return {
    id: user.id,
    name: user.username || undefined,
    username: user.username || undefined,
    email: user.email || '',
    avatar: user.avatar || undefined,
    emailVerified: !!user.emailVerified,
    status: user.status,
    role: user.role,
    tokens: {
      access: accessToken,
      refresh: refreshToken
    }
  };
};

export const createTokenResponse = (accessToken?: TokenResponse, refreshToken?: TokenResponse) => {
  return {
    accessToken: accessToken?.token,
    accessTokenExpire: accessToken?.expires.getTime(),
    refreshToken: refreshToken?.token,
    refreshTokenExpire: refreshToken?.expires.getTime()
  };
};
