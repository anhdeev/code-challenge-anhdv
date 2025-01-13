import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService } from '../services';
import exclude from '../utils/exclude';
import { Role, UserStatus } from '../constants/common.const';

const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  res.status(httpStatus.CREATED).send('ok');
});

const login = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;
  res.status(httpStatus.CREATED).send('ok');
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.status(httpStatus.CREATED).send('ok');
});

export default {
  register,
  login,
  logout,
  refreshTokens
};
