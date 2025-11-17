import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  '/',
  authenticate,
  [
    body('receiverId').notEmpty().withMessage('Receiver ID required'),
    body('message').trim().isLength({ min: 1 }).withMessage('Message cannot be empty'),
    body('itemId').optional(),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, message, itemId } = req.body;

    try {
      if (receiverId === req.userId) {
        return res.status(400).json({ error: 'Cannot send message to yourself' });
      }

      const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
      if (!receiver) {
        return res.status(404).json({ error: 'Receiver not found' });
      }

      if (itemId) {
        const item = await prisma.item.findUnique({ where: { id: itemId } });
        if (!item) {
          return res.status(404).json({ error: 'Item not found' });
        }
      }

      const newMessage = await prisma.message.create({
        data: {
          senderId: req.userId!,
          receiverId,
          message,
          itemId: itemId || null,
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true },
          },
          receiver: {
            select: { id: true, name: true, email: true },
          },
          item: {
            select: { id: true, title: true },
          },
        },
      });

      res.status(201).json({ message: 'Message sent', data: newMessage });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
);

router.get('/conversations', authenticate, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: req.userId! }, { receiverId: req.userId! }],
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
      orderBy: { timestamp: 'desc' },
    });

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const otherUserId = msg.senderId === req.userId ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderId === req.userId ? msg.receiver : msg.sender;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUser.name,
          lastMessage: msg.message,
          lastMessageTime: msg.timestamp,
          unreadCount: msg.receiverId === req.userId && !msg.read ? 1 : 0,
          item: msg.item,
        });
      } else {
        const conv = conversationsMap.get(otherUserId);
        if (msg.receiverId === req.userId && !msg.read) {
          conv.unreadCount += 1;
        }
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

router.get('/:userId', authenticate, async (req: AuthRequest, res) => {
  const { userId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.userId!, receiverId: userId },
          { senderId: userId, receiverId: req.userId! },
        ],
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
      orderBy: { timestamp: 'asc' },
    });

    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: req.userId!,
        read: false,
      },
      data: { read: true },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.get('/unread/count', authenticate, async (req: AuthRequest, res) => {
  try {
    const count = await prisma.message.count({
      where: {
        receiverId: req.userId!,
        read: false,
      },
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

export default router;
