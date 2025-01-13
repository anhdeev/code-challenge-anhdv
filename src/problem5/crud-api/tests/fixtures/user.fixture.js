"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUsers = exports.admin = exports.userTwo = exports.userOne = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const faker_1 = require("@faker-js/faker");
const prisma_1 = __importDefault(require("../../src/clients/prisma"));
const common_const_1 = require("../../src/constants/common.const");
const password = 'password1';
const salt = bcryptjs_1.default.genSaltSync(8);
exports.userOne = {
    name: faker_1.faker.name.fullName(),
    email: faker_1.faker.internet.email().toLowerCase(),
    password,
    role: common_const_1.Role.USER,
    emailVerified: false
};
exports.userTwo = {
    name: faker_1.faker.name.fullName(),
    email: faker_1.faker.internet.email().toLowerCase(),
    password,
    role: common_const_1.Role.USER,
    emailVerified: false
};
exports.admin = {
    name: faker_1.faker.name.fullName(),
    email: faker_1.faker.internet.email().toLowerCase(),
    password,
    role: common_const_1.Role.ADMIN,
    emailVerified: false
};
const insertUsers = async (users) => {
    await prisma_1.default.user.createMany({
        data: users.map((user) => ({ ...user, password: bcryptjs_1.default.hashSync(user.password || '', salt) }))
    });
};
exports.insertUsers = insertUsers;
