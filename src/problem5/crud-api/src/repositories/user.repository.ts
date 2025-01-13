import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

class UserRepository {
  // Create a new user
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  // Get user by ID
  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  // Update user
  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  // Delete user
  async deleteUser(id: number): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  // List all users
  async listUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }
}

export default new UserRepository();
