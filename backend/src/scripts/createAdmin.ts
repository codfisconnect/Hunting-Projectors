import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@huntingprojectors.com';
  const password = process.env.ADMIN_PASSWORD || 'HuntingAdmin@2026';
  const fullName = process.env.ADMIN_NAME || 'Hunting Store Administrator';
  const phoneNumber = process.env.ADMIN_PHONE || '+919444012345';

  console.log(`Setting up initial administrator account: ${email}`);

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      fullName,
      phoneNumber
    },
    create: {
      email,
      passwordHash,
      fullName,
      phoneNumber,
      role: 'ADMIN'
    }
  });

  console.log(`Administrator account verified successfully! ID: ${admin.id}, Role: ${admin.role}`);
}

createAdmin()
  .catch(err => {
    console.error('Failed to create administrator account:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
