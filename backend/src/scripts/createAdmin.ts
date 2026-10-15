import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_NAME || 'Hunting Store Administrator';
  const phoneNumber = process.env.ADMIN_PHONE || '+919444012345';

  if (!email || !password) {
    console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your backend/.env file before running seed:admin.');
    console.error('Example:');
    console.error('  ADMIN_EMAIL="admin@huntingprojectors.com"');
    console.error('  ADMIN_PASSWORD="YourStrongPassword123!"');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: ADMIN_PASSWORD must be at least 8 characters long.');
    process.exit(1);
  }

  console.log(`Checking administrator account for: ${email}`);

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    if (existingUser.role === 'ADMIN') {
      console.log(`Notice: An administrator account with email "${email}" already exists (ID: ${existingUser.id}). Existing credentials were not modified.`);
      return;
    } else {
      // User exists as customer, elevate role safely
      const updated = await prisma.user.update({
        where: { email },
        data: {
          role: 'ADMIN',
          fullName: fullName || existingUser.fullName,
          phoneNumber: phoneNumber || existingUser.phoneNumber
        }
      });
      console.log(`Account role elevated to ADMIN for user ID: ${updated.id}. Password was preserved.`);
      return;
    }
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      phoneNumber,
      role: 'ADMIN'
    }
  });

  console.log(`Administrator account created successfully! ID: ${admin.id}, Role: ${admin.role}`);
}

createAdmin()
  .catch(err => {
    console.error('Failed to create administrator account:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
