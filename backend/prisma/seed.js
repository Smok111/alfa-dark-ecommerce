const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@alfadark.com';
  const password = 'AlfaDark2026!';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: 'Admin',
      lastname: 'Alfa Dark',
      email: email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
