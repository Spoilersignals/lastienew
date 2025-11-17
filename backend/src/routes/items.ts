import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { containsProfanity, validatePrice } from '../utils/validation';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files allowed'));
  },
});

router.post(
  '/',
  authenticate,
  upload.single('image'),
  [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('category').notEmpty().withMessage('Category required'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, category, description, price, urgent } = req.body;

    if (containsProfanity(title) || containsProfanity(description)) {
      return res.status(400).json({ error: 'Inappropriate content detected' });
    }

    if (!validatePrice(parseFloat(price))) {
      return res.status(400).json({ error: 'Invalid price range' });
    }

    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const item = await prisma.item.create({
        data: {
          title,
          category,
          description,
          price: parseFloat(price),
          imageUrl,
          urgent: urgent === 'true',
          postedById: req.userId!,
          status: 'AVAILABLE',
        },
        include: {
          postedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      res.status(201).json({ message: 'Item posted successfully', item });
    } catch (error) {
      console.error('Error posting item:', error);
      res.status(500).json({ error: 'Failed to post item' });
    }
  }
);

router.get('/', async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    status,
    search,
    urgent,
    page = '1',
    limit = '20',
  } = req.query;

  try {
    const where: any = { status: status || 'AVAILABLE' };

    if (category) where.category = category;
    if (urgent === 'true') where.urgent = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take,
        orderBy: [{ urgent: 'desc' }, { datePosted: 'desc' }],
        include: {
          postedBy: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.item.count({ where }),
    ]);

    res.json({
      items,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: req.params.id },
      include: {
        postedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  const { title, description, price, status } = req.body;

  try {
    const item = await prisma.item.findUnique({
      where: { id: req.params.id },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.postedById !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedItem = await prisma.item.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(status && { status }),
      },
      include: {
        postedBy: {
          select: { id: true, name: true },
        },
      },
    });

    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: req.params.id },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.postedById !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.item.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

router.get('/user/my-items', authenticate, async (req: AuthRequest, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { postedById: req.userId! },
      orderBy: { datePosted: 'desc' },
      include: {
        postedBy: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

export default router;
