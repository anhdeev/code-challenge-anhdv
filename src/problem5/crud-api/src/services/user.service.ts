import { User, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../clients/prisma';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';
import { Role, UserStatus } from '../constants/common.const';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (user: {
  email: string;
  username: string;
  role: Role;
  status: UserStatus;
  name?: string;
  emailVerified?: Date;
  avatar?: string;
  note?: string;
  password?: string;
}): Promise<User> => {
  if (!user.email || (await getUserByEmail(user.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (user.username && (await getUserByUsername(user.username))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  return prisma.user.create({
    data: {
      ...user,
      password: user.password && (await encryptPassword(user.password))
    }
  });
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof User>(
  filter: any,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  search: string,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'username',
    'status',
    'password',
    'role',
    'emailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'DESC'; // PostgreSQL expects uppercase for direction
  const offset = (page - 1) * limit;
  const searchQuery = search?.length >= 2 ? search : null;

  const selectClause = keys.map((k) => `"${k}"`).join(', '); // Creates a string like: "id", "name", "email"
  const whereClauses: any[] = [];
  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== null && value !== '') {
      whereClauses.push(`"${key}" = '${value}'`);
    }
  }
  if (searchQuery) {
    whereClauses.push(`email like '%${searchQuery}%'`);
  }
  const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const orderByClause = sortBy ? `ORDER BY "${sortBy}" ${sortType}` : '';
  const rawSql = Prisma.sql`
  SELECT ${Prisma.raw(selectClause)}
  FROM "User"
  ${Prisma.raw(whereClause)}
  ${Prisma.raw(orderByClause)}
  LIMIT ${Prisma.raw(limit.toString())}
  OFFSET ${Prisma.raw(offset.toString())};
`;

  const users = await prisma.$queryRaw<User[]>(rawSql, searchQuery, offset, limit);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserById = async <Key extends keyof User>(
  id: number,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'username',
    'status',
    'password',
    'role',
    'emailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'username',
    'status',
    'password',
    'role',
    'emailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  const users = (await prisma.user.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  })) as Promise<Pick<User, Key> | null>;
  return users;
};

/**
 * Get user by username
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByUsername = async <Key extends keyof User>(
  username: string,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'username',
    'status',
    'password',
    'role',
    'emailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { username },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async <Key extends keyof User>(
  userId: number,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'username',
    'status',
    'role',
    'emailVerified',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  delete updateBody.username;
  const user = await getUserById(userId, ['id', 'email', 'name']);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (
    updateBody.email &&
    user.email !== updateBody.email &&
    (await getUserByEmail(updateBody.email as string))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedUser as Pick<User, Key> | null;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: number): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await prisma.user.delete({ where: { id: user.id } });
  return user;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUserById,
  deleteUserById
};
