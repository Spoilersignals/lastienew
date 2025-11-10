import { PrismaClient, NotificationType } from '@prisma/client';

const prisma = new PrismaClient();

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string
) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
