import { Role } from '@prisma/client';
import { Permission } from '../constants/auth.const';

const allRoles = {
  [Role.USER]: [
    Permission.READ_USER,
    Permission.VIEW_CHART,
    Permission.EDIT_CHART,
    Permission.ADD_ALERTEE
  ],
  [Role.ADMIN]: [Permission.READ_USER, Permission.MANAGE_USER]
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
