import { prisma } from "../db";
import { type ContactMessageInput } from "../../lib/schemas/contact.schema";

export class MessageService {
  static async createMessage(data: ContactMessageInput) {
    return prisma.contactMessage.create({
      data,
    });
  }

  static async getAllMessages() {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getMessageById(id: string) {
    return prisma.contactMessage.findUnique({
      where: { id },
    });
  }

  static async markAsRead(id: string, isRead: boolean = true) {
    return prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });
  }

  static async deleteMessage(id: string) {
    return prisma.contactMessage.delete({
      where: { id },
    });
  }
}
