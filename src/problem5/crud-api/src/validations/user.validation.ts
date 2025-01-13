import { Role, UserStatus } from '../constants/common.const';
import Joi from 'joi';
import { password } from './custom.validation';

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().optional(),
    username: Joi.string().optional(),
    avatar: Joi.string().optional(),
    status: Joi.string()
      .valid(...Object.values(UserStatus))
      .insensitive(),
    role: Joi.string()
      .valid(...Object.values(Role))
      .insensitive(),
    note: Joi.string().optional()
  })
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    filter: Joi.string().optional(),
    search: Joi.string().optional()
  })
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string()
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string()
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().optional().custom(password),
      name: Joi.string().optional(),
      username: Joi.string().optional(),
      avatar: Joi.string().optional(),
      status: Joi.string()
        .optional()
        .valid(...Object.values(UserStatus))
        .insensitive(),
      role: Joi.string()
        .optional()
        .valid(...Object.values(Role))
        .insensitive(),
      note: Joi.string().optional()
    })
    .min(1)
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string()
  })
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
