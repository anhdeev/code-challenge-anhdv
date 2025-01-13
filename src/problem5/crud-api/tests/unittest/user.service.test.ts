import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../src/clients/prisma';
import userService from '../../src/services/user.service';
import ApiError from '../../src/utils/ApiError';
import httpStatus from 'http-status';
import { encryptPassword } from '../../src/utils/encryption';
import { Role, UserStatus } from '../../src/constants/common.const';

jest.mock('../../src/clients/prisma', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  $queryRaw: jest.fn()
}));

jest.mock('../../src/utils/encryption', () => ({
  encryptPassword: jest.fn()
}));

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        username: 'user',
        role: 'user',
        status: 'active'
      };
      (prisma.user.create as jest.Mock<any>).mockResolvedValue(mockUser);
      (encryptPassword as jest.Mock<any>).mockResolvedValue('hashedPassword');

      const result = await userService.createUser({
        email: 'user@example.com',
        username: 'user',
        role: Role.USER,
        status: UserStatus.ACTIVE,
        password: 'password123'
      });

      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'user@example.com',
          username: 'user',
          role: 'user',
          status: 'active',
          password: 'hashedPassword'
        })
      });
    });

    it('should throw an error if email is already taken', async () => {
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue({ id: 1 });
      await expect(
        userService.createUser({
          email: 'user@example.com',
          username: 'user',
          role: Role.USER,
          status: UserStatus.ACTIVE
        })
      ).rejects.toThrow(new ApiError(httpStatus.BAD_REQUEST, 'Email already taken'));
    });

    it('should throw an error if username is already taken', async () => {
      (prisma.user.findUnique as jest.Mock<any>)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 1 });
      await expect(
        userService.createUser({
          email: 'user@example.com',
          username: 'user',
          role: Role.USER,
          status: UserStatus.ACTIVE
        })
      ).rejects.toThrow(new ApiError(httpStatus.BAD_REQUEST, 'Username already taken'));
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: 1, email: 'user@example.com', username: 'user' };
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Object)
      });
    });

    it('should return null if user is not found', async () => {
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(null);
      const result = await userService.getUserById(999);
      expect(result).toBeNull();
    });
  });

  describe('updateUserById', () => {
    it('should update a user by ID', async () => {
      const mockUser = { id: 1, email: 'user@example.com', name: 'user1' };
      (prisma.user.update as jest.Mock<any>).mockResolvedValue(mockUser);
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(mockUser);

      const result = await userService.updateUserById(1, { name: 'user1' });
      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { name: 'user1' },
          select: expect.any(Object)
        })
      );
    });

    it('should throw an error if user is not found', async () => {
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(null);
      await expect(userService.updateUserById(999, { email: 'new@example.com' })).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'User not found')
      );
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by ID', async () => {
      const mockUser = { id: 1, email: 'user@example.com', username: 'user' };
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(mockUser);
      (prisma.user.delete as jest.Mock<any>).mockResolvedValue(mockUser);

      const result = await userService.deleteUserById(1);
      expect(result).toEqual(mockUser);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if user is not found', async () => {
      (prisma.user.findUnique as jest.Mock<any>).mockResolvedValue(null);
      await expect(userService.deleteUserById(999)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'User not found')
      );
    });
  });
  describe('queryUsers', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a paginated list of users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', name: 'User One', username: 'user1' },
        { id: 2, email: 'user2@example.com', name: 'User Two', username: 'user2' }
      ];
      (prisma.$queryRaw as jest.Mock<any>).mockResolvedValue(mockUsers);

      const result = await userService.queryUsers({}, { limit: 2, page: 1 }, '');

      expect(prisma.$queryRaw).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should filter users based on provided filter criteria', async () => {
      const mockUsers = [
        { id: 1, email: 'admin@example.com', name: 'Admin User', username: 'admin' }
      ];
      (prisma.$queryRaw as jest.Mock<any>).mockResolvedValue(mockUsers);

      const result = await userService.queryUsers({ role: 'admin' }, { limit: 10, page: 1 }, '');
      expect(result).toEqual(mockUsers);
    });

    it('should apply search query to filter results', async () => {
      const mockUsers = [
        { id: 1, email: 'searchuser@example.com', name: 'Search User', username: 'searchuser' }
      ];
      (prisma.$queryRaw as jest.Mock<any>).mockResolvedValue(mockUsers);

      const result = await userService.queryUsers({}, { limit: 10, page: 1 }, 'search');
      expect(result).toEqual(mockUsers);
    });

    it('should sort users based on provided sort criteria', async () => {
      const mockUsers = [
        { id: 1, email: 'auser@example.com', name: 'User A', username: 'userA' },
        { id: 2, email: 'zuser@example.com', name: 'User Z', username: 'userZ' }
      ];
      (prisma.$queryRaw as jest.Mock<any>).mockResolvedValue(mockUsers);

      const result = await userService.queryUsers(
        {},
        { sortBy: 'name', sortType: 'asc', limit: 10, page: 1 },
        ''
      );

      expect(result).toEqual(mockUsers);
    });

    it('should return an empty array if no users match the query', async () => {
      (prisma.$queryRaw as jest.Mock<any>).mockResolvedValue([]);

      const result = await userService.queryUsers({}, { limit: 10, page: 1 }, 'nonexistent');

      expect(result).toEqual([]);
    });

    it('should handle pagination correctly', async () => {
      const mockUsers = [
        { id: 3, email: 'user3@example.com', name: 'User Three', username: 'user3' }
      ];
      (prisma.$queryRaw as jest.Mock<any>).mockResolvedValue(mockUsers);

      const result = await userService.queryUsers({}, { limit: 1, page: 3 }, '');

      expect(result).toEqual(mockUsers);
    });

    it('should handle multiple filter criteria', async () => {
      const mockUsers = [
        { id: 4, email: 'filtered@example.com', name: 'Filtered User', username: 'filter' }
      ];
      (prisma.$queryRaw as jest.Mock<any>).mockResolvedValue(mockUsers);

      const result = await userService.queryUsers(
        { role: 'user', status: 'active' },
        { limit: 5, page: 1 },
        ''
      );

      expect(result).toEqual(mockUsers);
    });

    it('should handle a combination of filters, search, and sorting', async () => {
      const mockUsers = [
        { id: 5, email: 'search@example.com', name: 'Search User', username: 'search' }
      ];
      (prisma.$queryRaw as jest.Mock<any>).mockResolvedValue(mockUsers);

      const result = await userService.queryUsers(
        { role: 'admin' },
        { limit: 10, page: 1, sortBy: 'email', sortType: 'desc' },
        'search'
      );
      expect(result).toEqual(mockUsers);
    });
  });
});
