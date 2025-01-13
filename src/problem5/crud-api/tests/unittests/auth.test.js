"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const faker_1 = require("@faker-js/faker");
const http_status_1 = __importDefault(require("http-status"));
const app_1 = __importDefault(require("../../src/app"));
const setupTestDb_1 = __importDefault(require("../utils/setupTestDb"));
const globals_1 = require("@jest/globals");
const common_const_1 = require("../../src/constants/common.const");
const prisma_1 = __importDefault(require("../../src/clients/prisma"));
(0, setupTestDb_1.default)();
(0, globals_1.describe)('Auth routes', () => {
    (0, globals_1.describe)('POST /v1/auth/register', () => {
        let newUser;
        (0, globals_1.beforeEach)(() => {
            newUser = {
                email: faker_1.faker.internet.email().toLowerCase(),
                password: 'password1'
            };
        });
        (0, globals_1.test)('should return 201 and successfully register user if request data is ok', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/register')
                .send(newUser)
                .expect(http_status_1.default.CREATED);
            (0, globals_1.expect)(res.body.user).not.toHaveProperty('password');
            (0, globals_1.expect)(res.body.user).toEqual({
                id: globals_1.expect.anything(),
                name: null,
                email: newUser.email,
                role: common_const_1.Role.USER,
                emailVerified: false
            });
            const dbUser = await prisma_1.default.user.findUnique({ where: { id: res.body.user.id } });
            (0, globals_1.expect)(dbUser).toBeDefined();
            (0, globals_1.expect)(dbUser?.password).not.toBe(newUser.password);
            (0, globals_1.expect)(dbUser).toMatchObject({
                name: null,
                email: newUser.email,
                role: common_const_1.Role.USER,
                emailVerified: false
            });
            (0, globals_1.expect)(res.body.tokens).toEqual({
                access: { token: globals_1.expect.anything(), expires: globals_1.expect.anything() },
                refresh: { token: globals_1.expect.anything(), expires: globals_1.expect.anything() }
            });
        });
        (0, globals_1.test)('should return 400 error if email is invalid', async () => {
            newUser.email = 'invalidEmail';
            await (0, supertest_1.default)(app_1.default).post('/v1/auth/register').send(newUser).expect(http_status_1.default.BAD_REQUEST);
        });
        (0, globals_1.test)('should return 400 error if password length is less than 8 characters', async () => {
            newUser.password = 'passwo1';
            await (0, supertest_1.default)(app_1.default).post('/v1/auth/register').send(newUser).expect(http_status_1.default.BAD_REQUEST);
        });
        (0, globals_1.test)('should return 400 error if password does not contain both letters and numbers', async () => {
            newUser.password = 'password';
            await (0, supertest_1.default)(app_1.default).post('/v1/auth/register').send(newUser).expect(http_status_1.default.BAD_REQUEST);
            newUser.password = '11111111';
            await (0, supertest_1.default)(app_1.default).post('/v1/auth/register').send(newUser).expect(http_status_1.default.BAD_REQUEST);
        });
    });
});
