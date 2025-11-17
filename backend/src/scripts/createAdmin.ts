import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('⚠️  An admin user already exists:');
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log('\nOnly one admin is allowed in the system.');
      rl.close();
      return;
    }

    console.log('=== Create Admin User ===\n');

    const name = await question('Admin name: ');
    const email = await question('Admin email: ');
    const password = await question('Admin password (min 6 chars): ');

    if (!name || !email || password.length < 6) {
      console.log('❌ Invalid input. Name, email, and password (min 6 chars) are required.');
      rl.close();
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log('❌ Email already registered.');
      rl.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: true,
      },
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log('\nYou can now log in with these credentials.');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
