import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService, userService, tokenService, emailService } from '../services';
import exclude from '../utils/exclude';
import { Role, User, UserStatus } from '@prisma/client';
import { TokenDto, UserCredentialDto } from '../dtos/userCredential.dto';

const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.createUser({
    email,
    password,
    role: Role.USER,
    username: email,
    status: UserStatus.ACTIVE
  });
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt']);
  const tokens = await tokenService.generateAuthTokens(user);
  res
    .status(httpStatus.CREATED)
    .send(new UserCredentialDto(userWithoutPassword, tokens.access, tokens.refresh));
});

const login = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(username, email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send(new UserCredentialDto(user, tokens.access, tokens.refresh));
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send(new TokenDto(tokens.access, tokens.refresh));
});

export default {
  register,
  login,
  logout,
  refreshTokens
};
