import { Prisma, PrismaClient, OrderItem } from "@prisma/client";

const prisma = new PrismaClient();

class OrderItemRepository {
  // Create a new order item
  async createOrderItem(data: Prisma.OrderItemCreateInput): Promise<OrderItem> {
    return prisma.orderItem.create({ data });
  }

  // Get an order item by ID
  async getOrderItemById(id: number): Promise<OrderItem | null> {
    return prisma.orderItem.findUnique({ where: { id } });
  }

  // Get all items for a specific order
  async getItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({ where: { orderId } });
  }

  // Update an order item by ID
  async updateOrderItem(
    id: number,
    data: Prisma.OrderItemUpdateInput
  ): Promise<OrderItem> {
    return prisma.orderItem.update({
      where: { id },
      data,
    });
  }

  // Delete an order item by ID
  async deleteOrderItem(id: number): Promise<OrderItem> {
    return prisma.orderItem.delete({ where: { id } });
  }
}

export default new OrderItemRepository();
