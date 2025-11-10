import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createNotification } from '../utils/notifications';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/',
  authenticate,
  [
    body('receiverId').notEmpty().withMessage('Receiver ID required'),
    body('message').trim().isLength({ min: 1 }).withMessage('Message cannot be empty'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, itemId, message } = req.body;

    if (receiverId === req.userId) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    try {
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
      });

      if (!receiver) {
        return res.status(404).json({ error: 'Receiver not found' });
      }

      const newMessage = await prisma.message.create({
        data: {
          senderId: req.userId!,
          receiverId,
          itemId: itemId || null,
          message,
        },
        include: {
          sender: {
            select: { id: true, name: true },
          },
          receiver: {
            select: { id: true, name: true },
          },
          item: {
            select: { id: true, title: true },
          },
        },
      });

      await createNotification(
        receiverId,
        'MESSAGE',
        'New Message',
        `You have a new message from ${newMessage.sender.name}`
      );

      res.status(201).json({ message: 'Message sent', data: newMessage });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
);

router.get('/inbox', authenticate, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ receiverId: req.userId! }, { senderId: req.userId! }],
      },
      orderBy: { timestamp: 'desc' },
      include: {
        sender: {
          select: { id: true, name: true },
        },
        receiver: {
          select: { id: true, name: true },
        },
        item: {
          select: { id: true, title: true },
        },
      },
    });

    const groupedMessages: any = {};
    messages.forEach((msg) => {
      const otherUserId = msg.senderId === req.userId ? msg.receiverId : msg.senderId;
      if (!groupedMessages[otherUserId]) {
        groupedMessages[otherUserId] = [];
      }
      groupedMessages[otherUserId].push(msg);
    });

    res.json(groupedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.get('/conversation/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.userId!, receiverId: req.params.userId },
          { senderId: req.params.userId, receiverId: req.userId! },
        ],
      },
      orderBy: { timestamp: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true },
        },
        receiver: {
          select: { id: true, name: true },
        },
        item: {
          select: { id: true, title: true },
        },
      },
    });

    await prisma.message.updateMany({
      where: {
        senderId: req.params.userId,
        receiverId: req.userId!,
        read: false,
      },
      data: { read: true },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

router.get('/unread-count', authenticate, async (req: AuthRequest, res) => {
  try {
    const count = await prisma.message.count({
      where: {
        receiverId: req.userId!,
        read: false,
      },
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

export default router;
