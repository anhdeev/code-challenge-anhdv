import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import prisma from '../../src/clients/prisma';
import tokenService from '../../src/services/token.service';
import userService from '../../src/services/user.service';
import ApiError from '../../src/utils/ApiError';
import { TokenType } from '../../src/constants/common.const';

jest.mock('jsonwebtoken');
jest.mock('../../src/clients/prisma', () => ({
  __esModule: true,
  default: {
    token: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn()
    }
  }
}));
jest.mock('../../src/services/user.service');

describe('Token Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a JWT token with correct payload', () => {
      const mockToken = 'mocked.token';
      (jwt.sign as jest.Mock<any>).mockReturnValue(mockToken);

      const userId = 1;
      const expires = moment().add(30, 'minutes');
      const token = tokenService.generateToken(userId, expires, TokenType.ACCESS);

      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: userId, iat: expect.any(Number), exp: expires.unix(), type: TokenType.ACCESS },
        expect.any(String)
      );
      expect(token).toBe(mockToken);
    });
  });

  describe('saveToken', () => {
    it('should delete existing tokens of the same type and save a new token', async () => {
      const userId = 1;
      const token = 'mocked.token';
      const expires = moment();
      const type = TokenType.ACCESS;

      (prisma.token.create as jest.Mock<any>).mockResolvedValue({ userId, token, expires });

      const savedToken = await tokenService.saveToken(userId, token, expires, type);

      expect(prisma.token.deleteMany).toHaveBeenCalledWith({
        where: { userId, type }
      });
      expect(prisma.token.create).toHaveBeenCalledWith({
        data: { userId, token, type, expires: expires.toDate() }
      });
      expect(savedToken).toEqual({ userId, token, expires });
    });
  });

  describe('verifyToken', () => {
    it('should return token data if token is valid', async () => {
      const token = 'mocked.token';
      const userId = 1;
      const type = TokenType.ACCESS;

      (jwt.verify as jest.Mock<any>).mockReturnValue({ sub: userId });
      (prisma.token.findFirst as jest.Mock<any>).mockResolvedValue({ userId, token, type });

      const result = await tokenService.verifyToken(token, type);

      expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
      expect(prisma.token.findFirst).toHaveBeenCalledWith({
        where: { userId, token, type }
      });
      expect(result).toEqual({ userId, token, type });
    });

    it('should throw an error if token is not found', async () => {
      const token = 'invalid.token';
      const type = TokenType.ACCESS;

      (jwt.verify as jest.Mock<any>).mockReturnValue({ sub: 1 });
      (prisma.token.findFirst as jest.Mock<any>).mockResolvedValue(null);

      await expect(tokenService.verifyToken(token, type)).rejects.toThrow('Token not found');
    });
  });

  describe('generateAuthTokens', () => {
    it('should generate and save access and refresh tokens', async () => {
      const user = { id: 1 };
      const mockAccessToken = 'access.token';
      const mockRefreshToken = 'refresh.token';

      (jwt.sign as jest.Mock<any>)
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);
      (prisma.token.create as jest.Mock<any>).mockResolvedValue({});

      const tokens = await tokenService.generateAuthTokens(user);

      expect(tokens).toEqual({
        access: { token: mockAccessToken, expires: expect.any(Date) },
        refresh: { token: mockRefreshToken, expires: expect.any(Date) }
      });
    });
  });

  describe('generateResetPasswordToken', () => {
    it('should generate and save a reset password token', async () => {
      const email = 'user@example.com';
      const mockUser = { id: 1 };
      const mockResetToken = 'reset.token';

      (userService.getUserByEmail as jest.Mock<any>).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock<any>).mockReturnValue(mockResetToken);
      (prisma.token.create as jest.Mock<any>).mockResolvedValue({});

      const token = await tokenService.generateResetPasswordToken(email);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(jwt.sign).toHaveBeenCalled();
      expect(prisma.token.create).toHaveBeenCalled();
      expect(token).toBe(mockResetToken);
    });

    it('should throw an error if user is not found', async () => {
      (userService.getUserByEmail as jest.Mock<any>).mockResolvedValue(null);

      await expect(tokenService.generateResetPasswordToken('notfound@example.com')).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'No users found with this email')
      );
    });
  });

  describe('getLastSession', () => {
    it('should return the last session data for given user IDs', async () => {
      const userIds = [1, 2];
      const mockSessions = [
        { userId: 1, createdAt: new Date(), updatedAt: new Date() },
        { userId: 2, createdAt: new Date(), updatedAt: new Date() }
      ];

      (prisma.token.findMany as jest.Mock<any>).mockResolvedValue(mockSessions);

      const result = await tokenService.getLastSession(userIds);

      expect(prisma.token.findMany).toHaveBeenCalledWith({
        where: { userId: { in: userIds }, type: TokenType.ACCESS }
      });
      expect(result).toEqual(
        mockSessions.map((session) => ({
          userId: session.userId,
          iat: session.createdAt,
          updatedAt: session.updatedAt
        }))
      );
    });
  });
});
