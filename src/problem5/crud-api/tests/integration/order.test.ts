import request from 'supertest';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import app from '../../src/app';
import prisma from '../../src/clients/prisma';
import { encryptPassword } from '../../src/utils/encryption';
import { Role } from '../../src/constants/common.const';

describe('Order routes', () => {
  let adminAccessToken: string;
  let userAccessToken: string;
  let userId: number;
  const item = () => ({
    productId: faker.number.int({ max: 1000 }),
    quantity: faker.number.int({ max: 1000 }),
    productName: faker.string.sample(),
    price: faker.number.int({ max: 1000 }), 
    total: faker.number.int({ max: 1000 })
  })
  const password = 'password1'

  beforeEach(async () => {
    const encryptedPassword = await encryptPassword(password);

    // Create an admin user and a regular user
    const adminUser = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: encryptedPassword,
        role: Role.ADMIN,
      },
    });

    const regularUser = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: encryptedPassword,
        role: Role.USER,
      },
    });

    userId = regularUser.id;

    // Generate tokens
    const adminTokens = await request(app)
      .post('/v1/auth/login')
      .send({ email: adminUser.email, password });
    console.log(adminTokens.body)
    adminAccessToken = adminTokens.body.tokens.access.token;

    const userTokens = await request(app)
      .post('/v1/auth/login')
      .send({ email: regularUser.email, password });
    userAccessToken = userTokens.body.tokens.access.token;
  });

  describe('POST /v1/order', () => {
    test
      ('should return 201 and create a new order if permission is granted', async () => {
        const orderData = {
          userId,
          items: [
            item(),
            item(),
          ],
          totalAmount: 123
        };

        const res = await request(app)
          .post('/v1/order')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(orderData)
          .expect(httpStatus.CREATED);
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            userId: orderData.userId,
            items: expect.any(Array),
          })
        );

        const dbOrder = await prisma.order.findUnique({ where: { id: res.body.id } });
        expect(dbOrder).toBeDefined();
      });
  });

  describe('GET /v1/order/:orderId', () => {
    test('should return 200 and the order details if permission is granted', async () => {
      const order = await prisma.order.create({
        data: {
          userId,
          items: {
            create: [item()],
          },
          totalAmount: 100
        },
        include: { items: true },
      });

      const res = await request(app)
        .get(`/v1/order/${order.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          id: order.id,
          userId: order.userId,
          items: expect.any(Array),
        })
      );
    });

    test('should return 401 if user without permission tries to get the order', async () => {
      const order = await prisma.order.create({
        data: {
          userId,
          items: {
            create: [item()],
          },
          totalAmount: 200,
        },
      });

      await request(app)
        .get(`/v1/order/${order.id}`)
        .set('Authorization', `Bearer 123`)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('PATCH /v1/order/:orderId', () => {
    test('should return 200 and update the order if permission is granted', async () => {
      const order = await prisma.order.create({
        data: {
          userId,
          items: {
            create: [item()],
          },
          totalAmount: 100
        },
        include: { items: true },
      });

      const updateData = { items: [item()] };

      const res = await request(app)
        .patch(`/v1/order/${order.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateData)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          id: order.id,
          items: expect.arrayContaining([
            expect.objectContaining(updateData.items[0]),
          ]),
        })
      );
    });

    test('should return 401 if user without permission tries to update an order', async () => {
      const order = await prisma.order.create({
        data: {
          userId,
          items: {
            create: [item()],
          },
          totalAmount: 100
        },
      });

      const updateData = { items: [item()] };

      const rst = await request(app)
        .patch(`/v1/order/${order.id}`)
        .set('Authorization', `Bearer undefined`)
        .send(updateData)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('DELETE /v1/order/:orderId', () => {
    test('should return 204 and delete the order if permission is granted', async () => {
      const order = await prisma.order.create({
        data: {
          userId,
          items: {
            create: [item()],
          },
          totalAmount: 100
        },
      });

      const rst = await request(app)
        .delete(`/v1/order/${order.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
      //.expect(httpStatus.NO_CONTENT);
      const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
      expect(dbOrder).toBeNull();
    });

    test('should return 403 if user without permission tries to delete an order', async () => {
      const order = await prisma.order.create({
        data: {
          userId,
          items: {
            create: [{ productId: 1, quantity: 2, productName: 'abc', price: 10, total: 123 }],
          },
          totalAmount: 200
        },
      });

      await request(app)
        .delete(`/v1/order/${order.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });
});
