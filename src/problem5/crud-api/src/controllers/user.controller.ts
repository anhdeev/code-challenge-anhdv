import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { tokenService, userService } from '../services';
import { UserStatus } from '../constants/common.const';
import { createUserResponse } from '../utils/formatResponse';

const createUser = catchAsync(async (req, res, _next) => {
  const { email, password, name, role, username, status, note, avatar } = req.body;
  const user = await userService.createUser({
    email,
    password,
    name,
    role,
    username: username || email,
    status: status || UserStatus.ACTIVE,
    note,
    avatar
  });
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const search = req.query.search as string;
  const users = await userService.queryUsers(filter, options, search);
  const sessions = await tokenService.getLastSession(users.map((user) => user.id));
  res.send(createUserResponse(users, sessions));
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMe = catchAsync(async (req, res) => {
  console.log(req.user);
  res.send({ ...req.user });
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe
};
