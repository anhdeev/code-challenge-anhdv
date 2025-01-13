import httpStatus from 'http-status';
import tokenService from './token.service';
import userService from './user.service';
import ApiError from '../utils/ApiError';
import { Role, User, UserStatus, TokenType } from '@prisma/client';
import prisma from '../clients/prisma';
import { encryptPassword, isPasswordMatch } from '../utils/encryption';
import { AuthTokensResponse } from '../types/auth';
import exclude from '../utils/exclude';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<User, 'password'>>}
 */
const loginUserWithEmailAndPassword = async (
  username: string,
  email: string,
  password: string
): Promise<Omit<User, 'password'>> => {
  if (!username && !email) throw new ApiError(httpStatus.BAD_REQUEST, 'Bad Request');
  const getUser = email ? userService.getUserByEmail : userService.getUserByUsername;
  const user = await getUser(email || username, [
    'id',
    'email',
    'username',
    'name',
    'password',
    'role',
    'status',
    'avatar',
    'note',
    'role',
    'status',
    'emailVerified',
    'createdAt',
    'updatedAt',
    'deletedAt'
  ]);
  if (!user || !(await isPasswordMatch(password, user.password as string))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect email or password');
  }
  return exclude(user, ['password']);
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenData = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: TokenType.REFRESH
    }
  });
  if (!refreshTokenData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await prisma.token.deleteMany({ where: { userId: refreshTokenData.userId } });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<AuthTokensResponse>}
 */
const refreshAuth = async (refreshToken: string): Promise<AuthTokensResponse> => {
  try {
    const refreshTokenData = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
    const { userId } = refreshTokenData;
    await prisma.token.delete({ where: { id: refreshTokenData.id } });
    return tokenService.generateAuthTokens({ id: userId });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

export default {
  loginUserWithEmailAndPassword,
  isPasswordMatch,
  encryptPassword,
  logout,
  refreshAuth
};
