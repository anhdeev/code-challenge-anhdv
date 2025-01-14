import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import orderService from '../services/order.service';

/**
 * Create a new order
 */
const createOrder = catchAsync(async (req, res) => {
  const { userId, status, totalAmount, items } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order must have at least one item.');
  }

  const order = await orderService.createOrder({ status, totalAmount, user: {connect: { id: userId } } }, items);

  res.status(httpStatus.CREATED).send(order);
});

/**
 * Get a single order by ID
 */
const getOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await orderService.getOrderById(Number(orderId));
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  res.send(order);
});

/**
 * Get all orders for a specific user
 */
const getOrdersByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const orders = await orderService.getOrdersByUserId(Number(userId));
  res.send(orders);
});

/**
 * Update an order
 */
const updateOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status, totalAmount, items } = req.body;

  const order = await orderService.updateOrder(Number(orderId), { status, totalAmount }, items);
  res.send(order);
});

/**
 * Delete an order by ID
 */
const deleteOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  await orderService.deleteOrderById(Number(orderId));
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Add items to an existing order
 */
const addItemsToOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { items } = req.body;

  const order = await orderService.addItemsToOrder(Number(orderId), items);
  res.send(order);
});

/**
 * Remove items from an order
 */
const removeItemsFromOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { itemIds } = req.body;

  const order = await orderService.removeItemsFromOrder(Number(orderId), itemIds);
  res.send(order);
});

export default {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  deleteOrderById,
  addItemsToOrder,
  removeItemsFromOrder
};
