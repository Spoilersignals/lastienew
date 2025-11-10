import { PrismaClient, Category, ItemStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@university.edu',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@university.edu',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Smith',
        email: 'bob@college.edu',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carol Williams',
        email: 'carol@university.ac.uk',
        password: hashedPassword,
      },
    }),
  ]);

  const items = await Promise.all([
    prisma.item.create({
      data: {
        title: 'Introduction to Computer Science Textbook',
        category: Category.BOOKS,
        description: 'Barely used CS101 textbook. Great condition, no highlights or notes.',
        price: 45.0,
        imageUrl: null,
        urgent: false,
        postedById: users[0].id,
        status: ItemStatus.AVAILABLE,
      },
    }),
    prisma.item.create({
      data: {
        title: 'MacBook Pro 2019 - 13 inch',
        category: Category.ELECTRONICS,
        description: 'Selling my MacBook Pro. 8GB RAM, 256GB SSD. Works perfectly!',
        price: 650.0,
        imageUrl: null,
        urgent: true,
        postedById: users[1].id,
        status: ItemStatus.AVAILABLE,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Twin Size Mattress',
        category: Category.FURNITURE,
        description: 'Moving out! Free mattress, good condition. Pick up only.',
        price: 0,
        imageUrl: null,
        urgent: false,
        postedById: users[0].id,
        status: ItemStatus.AVAILABLE,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Scientific Calculator TI-84',
        category: Category.ELECTRONICS,
        description: 'Used for engineering classes. All functions working.',
        price: 80.0,
        imageUrl: null,
        urgent: false,
        postedById: users[2].id,
        status: ItemStatus.AVAILABLE,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Winter Jacket - Size M',
        category: Category.CLOTHING,
        description: 'North Face winter jacket, barely worn. Great for cold weather.',
        price: 120.0,
        imageUrl: null,
        urgent: false,
        postedById: users[1].id,
        status: ItemStatus.AVAILABLE,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Basketball',
        category: Category.SPORTS,
        description: 'Official size basketball, good condition.',
        price: 15.0,
        imageUrl: null,
        urgent: false,
        postedById: users[2].id,
        status: ItemStatus.AVAILABLE,
      },
    }),
  ]);

  await prisma.message.create({
    data: {
      senderId: users[1].id,
      receiverId: users[0].id,
      itemId: items[0].id,
      message: 'Hi! Is the CS textbook still available?',
    },
  });

  await prisma.message.create({
    data: {
      senderId: users[0].id,
      receiverId: users[1].id,
      itemId: items[0].id,
      message: 'Yes it is! When would you like to pick it up?',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📝 Sample credentials:');
  console.log('Admin: admin@university.edu / password123');
  console.log('Student 1: alice@university.edu / password123');
  console.log('Student 2: bob@college.edu / password123');
  console.log('Student 3: carol@university.ac.uk / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
