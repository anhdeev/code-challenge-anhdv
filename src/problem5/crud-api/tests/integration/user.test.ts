import request from 'supertest';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import app from '../../src/app';
import setupTestDB from '../utils/setupTestDb';
import prisma from '../../src/clients/prisma';
import { Role, UserStatus } from '../../src/constants/common.const';
import { encryptPassword } from '../../src/utils/encryption';

setupTestDB();

describe('User routes', () => {
  let adminAccessToken: string;
  let userAccessToken: string;
  const password = 'password1';
  beforeEach(async () => {
    const encryptedPassword = await encryptPassword(password);

    // Create an admin and a regular user
    const adminUser = await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        password: encryptedPassword,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    const regularUser = await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        password: encryptedPassword,
        role: Role.USER,
        status: UserStatus.ACTIVE,
      },
    });
    // Generate tokens
    const adminTokens = await request(app)
      .post('/v1/auth/login')
      .send({ email: adminUser.email, password });
    adminAccessToken = adminTokens.body.tokens.access.token;

    const userTokens = await request(app)
      .post('/v1/auth/login')
      .send({ email: regularUser.email, password });
    userAccessToken = userTokens.body.tokens.access.token;
  });

  describe('POST /v1/user', () => {
    test('should return 201 and create a new user if admin', async () => {
      const newUser = {
        email: faker.internet.email(),
        password: 'password123',
        name: faker.name.fullName(),
        username: faker.internet.userName(),
        role: Role.USER,
        status: UserStatus.ACTIVE,
      };

      const res = await request(app)
        .post('/v1/user')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        })
      );

      const dbUser = await prisma.user.findUnique({ where: { email: newUser.email } });
      expect(dbUser).toBeDefined();
    });

    test('should return 403 if non-admin tries to create a user', async () => {
      const newUser = {
        email: faker.internet.email(),
        password: 'password123',
        name: faker.name.fullName(),
        role: Role.USER,
      };

      await request(app)
        .post('/v1/user')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(newUser)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/user', () => {
    test('should return 200 and all users if admin', async () => {
      const res = await request(app)
        .get('/v1/user')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(expect.any(Array));
      expect(res.body.length).toBeGreaterThan(1);
    });

    test('should return 403 if non-admin tries to access user list', async () => {
      await request(app)
        .get('/v1/user')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/user/:userId', () => {
    test('should return 200 and the user if admin', async () => {
      const user = await prisma.user.findFirst({ where: { role: Role.USER } });

      const res = await request(app)
        .get(`/v1/user/${user?.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        //.expect(httpStatus.OK);
      console.log(res.body)
      expect(res.body).toEqual(
        expect.objectContaining({
          id: user?.id,
          email: user?.email,
        })
      );
    });

    test('should return 404 if user not found', async () => {
      await request(app)
        .get(`/v1/user/99999`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/user/:userId', () => {
    test('should return 200 and update user if admin', async () => {
      const user = await prisma.user.findFirst({ where: { role: Role.USER } });

      const updateData = { name: 'Updated Name' };

      const res = await request(app)
        .patch(`/v1/user/${user?.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateData)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(expect.objectContaining({ name: updateData.name }));
    });

    test('should return 403 if non-admin tries to update user', async () => {
      const user = await prisma.user.findFirst({ where: { role: Role.USER } });

      const updateData = { name: 'Updated Name' };

      await request(app)
        .patch(`/v1/user/${user?.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(updateData)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('DELETE /v1/user/:userId', () => {
    test('should return 204 and delete user if admin', async () => {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: 'password123',
          role: Role.USER,
        },
      });

      await request(app)
        .delete(`/v1/user/${user.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(dbUser).toBeNull();
    });

    test('should return 403 if non-admin tries to delete user', async () => {
      const user = await prisma.user.findFirst({ where: { role: Role.USER } });

      await request(app)
        .delete(`/v1/user/${user?.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/user/me', () => {
    test('should return 200 and the authenticated user\'s details', async () => {
      const res = await request(app)
        .get('/v1/user/me')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(expect.objectContaining({ role: Role.USER }));
    });

    test('should return 401 if no access token is provided', async () => {
      await request(app).get('/v1/user/me').expect(httpStatus.UNAUTHORIZED);
    });
  });
});
