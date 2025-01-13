import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../src/clients/prisma';
import orderService from '../../src/services/order.service';
import ApiError from '../../src/utils/ApiError';
import httpStatus from 'http-status';

jest.mock('../../src/clients/prisma', () => ({
  __esModule: true,
  default: {
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    orderItem: {
      createMany: jest.fn(),
      deleteMany: jest.fn()
    }
  }
}));

describe('Order Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order with items', async () => {
      const mockOrder = { id: 1, items: [] };
      const orderData = { userId: 1, status: 'PENDING', totalAmount: 100 };
      const items = [{ productId: 1, quantity: 2, price: 50 }];

      (prisma.order.create as jest.Mock<any>).mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(orderData as any, items as any);

      expect(prisma.order.create).toHaveBeenCalledWith({
        data: { ...orderData, items: { create: items } },
        include: { items: true }
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if no items are provided', async () => {
      const orderData = { userId: 1, status: 'PENDING', totalAmount: 100 };

      await expect(orderService.createOrder(orderData as any, [])).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Order must have at least one item.')
      );
    });
  });

  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      const mockOrder = { id: 1, items: [] };
      (prisma.order.findUnique as jest.Mock<any>).mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(1);

      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { items: true }
      });
      expect(result).toEqual(mockOrder);
    });

    it('should return null if order is not found', async () => {
      (prisma.order.findUnique as jest.Mock<any>).mockResolvedValue(null);

      const result = await orderService.getOrderById(999);

      expect(result).toBeNull();
    });
  });

  describe('getOrdersByUserId', () => {
    it('should return orders for a user', async () => {
      const mockOrders = [{ id: 1, items: [] }];
      (prisma.order.findMany as jest.Mock<any>).mockResolvedValue(mockOrders);

      const result = await orderService.getOrdersByUserId(1);

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { items: true }
      });
      expect(result).toEqual(mockOrders);
    });
  });

  describe('updateOrder', () => {
    it('should update an order with new items', async () => {
      const mockOrder = { id: 1, items: [] };
      const updateData = { status: 'COMPLETED', totalAmount: 150 };
      const items = [{ productId: 1, quantity: 3, price: 50 }];

      (prisma.order.findUnique as jest.Mock<any>).mockResolvedValue(mockOrder);
      (prisma.order.update as jest.Mock<any>).mockResolvedValue(mockOrder);

      const result = await orderService.updateOrder(1, updateData, items as any);

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateData,
          items: { deleteMany: {}, create: items }
        },
        include: { items: true }
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if order is not found', async () => {
      (prisma.order.findUnique as jest.Mock<any>).mockResolvedValue(null);

      await expect(orderService.updateOrder(999, {}, [])).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Order not found')
      );
    });
  });

  describe('deleteOrderById', () => {
    it('should delete an order and its items', async () => {
      const mockOrder = { id: 1 };
      (prisma.order.findUnique as jest.Mock<any>).mockResolvedValue(mockOrder);

      await orderService.deleteOrderById(1);

      expect(prisma.orderItem.deleteMany).toHaveBeenCalledWith({ where: { orderId: 1 } });
      expect(prisma.order.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if order is not found', async () => {
      (prisma.order.findUnique as jest.Mock<any>).mockResolvedValue(null);

      await expect(orderService.deleteOrderById(999)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Order not found')
      );
    });
  });

  describe('addItemsToOrder', () => {
    it('should add items to an existing order', async () => {
      const items = [{ productId: 1, quantity: 2, price: 50 }];
      const mockOrder = { id: 1, items };

      (prisma.orderItem.createMany as jest.Mock<any>).mockResolvedValue(undefined);
      (prisma.order.findUnique as jest.Mock<any>).mockResolvedValue(mockOrder);

      const result = await orderService.addItemsToOrder(1, items as any);

      expect(prisma.orderItem.createMany).toHaveBeenCalledWith({
        data: items.map((item) => ({ ...item, orderId: 1 }))
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if no items are provided', async () => {
      await expect(orderService.addItemsToOrder(1, [])).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'At least one item must be added.')
      );
    });
  });

  describe('removeItemsFromOrder', () => {
    it('should remove items from an order', async () => {
      const itemIds = [1, 2];
      const mockOrder = { id: 1, items: [] };

      (prisma.orderItem.deleteMany as jest.Mock<any>).mockResolvedValue(undefined);
      (prisma.order.findUnique as jest.Mock<any>).mockResolvedValue(mockOrder);

      const result = await orderService.removeItemsFromOrder(1, itemIds);

      expect(prisma.orderItem.deleteMany).toHaveBeenCalledWith({
        where: { orderId: 1, id: { in: itemIds } }
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw an error if no item IDs are provided', async () => {
      await expect(orderService.removeItemsFromOrder(1, [])).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'No items specified for removal.')
      );
    });
  });
});
