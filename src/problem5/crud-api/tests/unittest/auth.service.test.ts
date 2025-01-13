import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import httpStatus from 'http-status';
import authService from '../../src/services/auth.service';
import userService from '../../src/services/user.service';
import tokenService from '../../src/services/token.service';
import prisma from '../../src/clients/prisma';
import ApiError from '../../src/utils/ApiError';
import { isPasswordMatch } from '../../src/utils/encryption';

jest.mock('../../src/services/user.service');
jest.mock('../../src/services/token.service');
jest.mock('../../src/clients/prisma', () => ({
  __esModule: true,
  default: {
    token: {
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
      delete: jest.fn()
    }
  }
}));
jest.mock('../../src/utils/encryption');

describe('Auth Service', () => {
  describe('loginUserWithEmailAndPassword', () => {
    it('should throw an error if email and username are missing', async () => {
      await expect(authService.loginUserWithEmailAndPassword('', '', 'password')).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Bad Request')
      );
    });

    it('should throw an error if user is not found', async () => {
      (userService.getUserByEmail as jest.Mock<any>).mockResolvedValue(null);
      await expect(
        authService.loginUserWithEmailAndPassword('', 'email@example.com', 'password')
      ).rejects.toThrow(new ApiError(httpStatus.NOT_FOUND, 'Incorrect email or password'));
    });

    it('should throw an error if password does not match', async () => {
      const mockUser: { password: string } = { password: 'hashedPassword' };
      (userService.getUserByEmail as jest.Mock<any>).mockResolvedValue(mockUser);
      (isPasswordMatch as jest.Mock<any>).mockResolvedValue(false);

      await expect(
        authService.loginUserWithEmailAndPassword('', 'email@example.com', 'password')
      ).rejects.toThrow(new ApiError(httpStatus.NOT_FOUND, 'Incorrect email or password'));
    });

    it('should return user without password if login is successful', async () => {
      const mockUser = { id: 1, email: 'email@example.com', password: 'hashedPassword' };
      (userService.getUserByEmail as jest.Mock<any>).mockResolvedValue(mockUser);
      (isPasswordMatch as jest.Mock<any>).mockResolvedValue(true);

      const result = await authService.loginUserWithEmailAndPassword(
        '',
        'email@example.com',
        'password'
      );
      expect(result).toEqual({ id: 1, email: 'email@example.com' });
    });
  });

  describe('logout', () => {
    it('should throw an error if refresh token is not found', async () => {
      jest.spyOn(prisma.token, 'findFirst').mockResolvedValue(null);

      await expect(authService.logout('invalidToken')).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Not found')
      );
    });

    it('should delete all tokens for the user if refresh token is valid', async () => {
      const mockToken = { userId: 1 };
      (prisma.token.findFirst as jest.Mock<any>).mockResolvedValue(mockToken);
      (prisma.token.deleteMany as jest.Mock<any>).mockResolvedValue(undefined);

      await authService.logout('validToken');
      expect(prisma.token.deleteMany).toHaveBeenCalledWith({ where: { userId: 1 } });
    });
  });

  describe('refreshAuth', () => {
    it('should throw an error if token verification fails', async () => {
      (tokenService.verifyToken as jest.Mock<any>).mockRejectedValue(new Error('Invalid token'));

      await expect(authService.refreshAuth('invalidToken')).rejects.toThrow(
        new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
      );
    });

    it('should delete old refresh token and generate new tokens if refresh token is valid', async () => {
      const mockRefreshTokenData = { id: 1, userId: 2 };
      (tokenService.verifyToken as jest.Mock<any>).mockResolvedValue(mockRefreshTokenData);
      (tokenService.generateAuthTokens as jest.Mock<any>).mockResolvedValue({
        access: 'newAccessToken',
        refresh: 'newRefreshToken'
      });
      (prisma.token.delete as jest.Mock<any>).mockResolvedValue(undefined);

      const result = await authService.refreshAuth('validToken');

      expect(prisma.token.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(tokenService.generateAuthTokens).toHaveBeenCalledWith({ id: 2 });
      expect(result).toEqual({ access: 'newAccessToken', refresh: 'newRefreshToken' });
    });
  });
});
