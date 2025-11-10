import express from 'express';
import { PrismaClient, ItemStatus } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { createNotification } from '../utils/notifications';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalItems, activeItems, flaggedItems, totalMessages] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.item.count({ where: { status: ItemStatus.AVAILABLE } }),
      prisma.item.count({ where: { status: ItemStatus.FLAGGED } }),
      prisma.message.count(),
    ]);

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const recentItems = await prisma.item.findMany({
      take: 10,
      orderBy: { datePosted: 'desc' },
      include: {
        postedBy: {
          select: { id: true, name: true },
        },
      },
    });

    res.json({
      stats: {
        totalUsers,
        totalItems,
        activeItems,
        flaggedItems,
        totalMessages,
      },
      recentUsers,
      recentItems,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/items/pending', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { status: ItemStatus.PENDING_APPROVAL },
      orderBy: { datePosted: 'desc' },
      include: {
        postedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending items' });
  }
});

router.get('/items/flagged', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { status: ItemStatus.FLAGGED },
      orderBy: { datePosted: 'desc' },
      include: {
        postedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flagged items' });
  }
});

router.put('/items/:id/approve', async (req, res) => {
  try {
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: { status: ItemStatus.AVAILABLE },
      include: {
        postedBy: true,
      },
    });

    await createNotification(
      item.postedById,
      'ITEM_APPROVED',
      'Item Approved',
      `Your item "${item.title}" has been approved and is now live`
    );

    res.json({ message: 'Item approved', item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve item' });
  }
});

router.put('/items/:id/flag', async (req, res) => {
  const { reason } = req.body;

  try {
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: { status: ItemStatus.FLAGGED },
      include: {
        postedBy: true,
      },
    });

    await createNotification(
      item.postedById,
      'ITEM_FLAGGED',
      'Item Flagged',
      `Your item "${item.title}" has been flagged. Reason: ${reason || 'Policy violation'}`
    );

    res.json({ message: 'Item flagged', item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to flag item' });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    await prisma.item.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        blocked: true,
        _count: {
          select: { items: true, sentMessages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id/block', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { blocked: true },
    });

    res.json({ message: 'User blocked', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to block user' });
  }
});

router.put('/users/:id/unblock', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { blocked: false },
    });

    res.json({ message: 'User unblocked', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

export default router;
