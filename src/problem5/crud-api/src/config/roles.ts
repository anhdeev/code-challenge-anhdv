import { Role } from '../constants/common.const';
import { Permission } from '../constants/auth.const';

const allRoles = {
  [Role.USER]: [
    Permission.READ_USER,
    Permission.CREATE_ORDER,
    Permission.EDIT_ORDER,
    Permission.VIEW_ORDER
  ],
  [Role.ADMIN]: [Permission.READ_USER, Permission.MANAGE_USER, Permission.CREATE_ORDER, Permission.DELETE_ORDER, Permission.EDIT_ORDER, Permission.VIEW_ORDER]
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
