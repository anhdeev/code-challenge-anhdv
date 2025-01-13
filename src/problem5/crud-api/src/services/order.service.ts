import { Prisma, Order, OrderItem } from "@prisma/client";
import prisma from "../clients/prisma";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

/**
 * Create an order with items
 * @param {Object} orderData - Order data
 * @param {Array<Object>} items - List of order items
 * @returns {Promise<Order>}
 */
const createOrder = async (
  orderData: Prisma.OrderCreateInput,
  items: Prisma.OrderItemCreateInput[]
): Promise<Order> => {
  if (!items || items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order must have at least one item.");
  }

  return prisma.order.create({
    data: {
      ...orderData,
      items: {
        create: items,
      },
    },
    include: {
      items: true,
    },
  });
};

/**
 * Get order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Order | null>}
 */
const getOrderById = async (orderId: number): Promise<Order | null> => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
};

/**
 * Get orders by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Order[]>}
 */
const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
  });
};

/**
 * Update an order and its items
 * @param {number} orderId - Order ID
 * @param {Object} updateData - Order update data
 * @param {Array<Object>} items - Updated list of order items
 * @returns {Promise<Order>}
 */
const updateOrder = async (
  orderId: number,
  updateData: Prisma.OrderUpdateInput,
  items?: Prisma.OrderItemCreateInput[]
): Promise<Order> => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      ...updateData,
      items: items
        ? {
            deleteMany: {}, // Delete existing items
            create: items, // Add new items
          }
        : undefined,
    },
    include: { items: true },
  });

  return updatedOrder;
};

/**
 * Delete order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (orderId: number): Promise<Order> => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  await prisma.orderItem.deleteMany({ where: { orderId } }); // Delete associated items
  return prisma.order.delete({ where: { id: orderId } });
};

/**
 * Add items to an existing order
 * @param {number} orderId - Order ID
 * @param {Array<Object>} items - List of items to add
 * @returns {Promise<Order>}
 */
const addItemsToOrder = async (
  orderId: number,
  items: Prisma.OrderItemCreateInput[]
): Promise<Order> => {
  if (!items || items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "At least one item must be added.");
  }

  await prisma.orderItem.createMany({
    data: items.map((item) => ({
      ...item,
      orderId,
    })),
  });

  return getOrderById(orderId) as Promise<Order>;
};

/**
 * Remove items from an order
 * @param {number} orderId - Order ID
 * @param {Array<number>} itemIds - IDs of items to remove
 * @returns {Promise<Order>}
 */
const removeItemsFromOrder = async (orderId: number, itemIds: number[]): Promise<Order> => {
  if (!itemIds || itemIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No items specified for removal.");
  }

  await prisma.orderItem.deleteMany({
    where: {
      orderId,
      id: { in: itemIds },
    },
  });

  return getOrderById(orderId) as Promise<Order>;
};

export default {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  deleteOrderById,
  addItemsToOrder,
  removeItemsFromOrder,
};
