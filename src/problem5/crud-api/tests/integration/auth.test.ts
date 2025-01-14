import request from 'supertest';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import app from '../../src/app';
import setupTestDB from '../utils/setupTestDb';
import { describe, beforeEach, test, expect } from '@jest/globals';
import { Role } from '../../src/constants/common.const';
import prisma from '../../src/clients/prisma';

setupTestDB();

describe.skip('Auth routes', () => {
  describe('POST /v1/auth/register', () => {
    let newUser: { email: string; password: string };
    beforeEach(() => {
      newUser = {
        email: faker.internet.email().toLowerCase(),
        password: 'password1'
      };
    });

    test('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(newUser)
        .expect(httpStatus.CREATED);

      console.log(res.body);
      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          email: newUser.email,
          role: Role.USER,
          emailVerified: false
        })
      );

      const dbUser = await prisma.user.findUnique({ where: { id: res.body.id } });
      expect(dbUser).toBeDefined();
      expect(dbUser?.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        name: null,
        email: newUser.email,
        role: Role.USER,
        emailVerified: null
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() }
      });
    });

    test('should return 400 error if email is invalid', async () => {
      newUser.email = 'invalidEmail';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain both letters and numbers', async () => {
      newUser.password = 'password';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);

      newUser.password = '11111111';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });
  });
});
