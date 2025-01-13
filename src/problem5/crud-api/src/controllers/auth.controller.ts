import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService, userService, tokenService } from '../services';
import exclude from '../utils/exclude';
import { Role, UserStatus } from '../constants/common.const';
import { createTokenResponse, createUserCredentialResponse } from '../utils/formatResponse';

const register = catchAsync(async (req, res) => {
  const { email, password, username } = req.body;
  const user = await userService.createUser({
    email,
    password,
    role: Role.USER,
    username,
    status: UserStatus.ACTIVE
  });
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt']);
  const tokens = await tokenService.generateAuthTokens(user);
  res
    .status(httpStatus.CREATED)
    .send(createUserCredentialResponse(userWithoutPassword, tokens.access, tokens.refresh));
});

const login = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(username, email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send(createUserCredentialResponse(user, tokens.access, tokens.refresh));
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send(createTokenResponse(tokens.access, tokens.refresh));
});

export default {
  register,
  login,
  logout,
  refreshTokens
};
