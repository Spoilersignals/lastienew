import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

const requireAdmin = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.get('/users', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        blocked: true,
        createdAt: true,
        _count: {
          select: {
            items: true,
            sentMessages: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post(
  '/users',
  authenticate,
  requireAdmin,
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['STUDENT', 'ADMIN']).withMessage('Invalid role'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role = 'STUDENT' } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          emailVerified: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      });

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

router.put('/users/:userId/block', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const { userId } = req.params;
  const { blocked } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      return res.status(403).json({ error: 'Cannot block admin users' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { blocked: blocked === true },
      select: {
        id: true,
        name: true,
        email: true,
        blocked: true,
      },
    });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:userId', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/items', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        postedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { datePosted: 'desc' },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.put('/items/:itemId/status', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const { itemId } = req.params;
  const { status } = req.body;

  if (!['AVAILABLE', 'SOLD', 'PENDING', 'REMOVED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const item = await prisma.item.findUnique({ where: { id: itemId } });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: { status },
      include: {
        postedBy: {
          select: { id: true, name: true },
        },
      },
    });

    res.json({ message: 'Item status updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item status' });
  }
});

router.delete('/items/:itemId', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  const { itemId } = req.params;

  try {
    const item = await prisma.item.findUnique({ where: { id: itemId } });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await prisma.item.delete({ where: { id: itemId } });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

router.get('/stats', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [totalUsers, totalItems, totalMessages, verifiedUsers] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.message.count(),
      prisma.user.count({ where: { emailVerified: true } }),
    ]);

    const itemsByStatus = await prisma.item.groupBy({
      by: ['status'],
      _count: true,
    });

    res.json({
      totalUsers,
      totalItems,
      totalMessages,
      verifiedUsers,
      itemsByStatus,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

router.get('/messages', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
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
      orderBy: { timestamp: 'desc' },
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching admin messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
