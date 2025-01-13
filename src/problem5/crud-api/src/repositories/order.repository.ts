import { Prisma, PrismaClient, Order } from "@prisma/client";

const prisma = new PrismaClient();

class OrderRepository {
  // Create a new order with items
  async createOrder(data: Prisma.OrderCreateInput): Promise<Order> {
    return prisma.order.create({
      data,
      include: { items: true }, // Include related items in the response
    });
  }

  // Get an order by ID
  async getOrderById(id: number): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true }, // Include related items in the response
    });
  }

  // Get all orders by user ID
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true }, // Include related items in the response
    });
  }

  // Update an order by ID
  async updateOrder(
    id: number,
    data: Prisma.OrderUpdateInput
  ): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data,
      include: { items: true },
    });
  }

  // Delete an order by ID
  async deleteOrder(id: number): Promise<Order> {
    return prisma.order.delete({
      where: { id },
    });
  }

  // List all orders
  async listOrders(): Promise<Order[]> {
    return prisma.order.findMany({
      include: { items: true },
    });
  }
}

export default new OrderRepository();
