const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Alfa Dark Database Seed...');

  // 1. Crear el usuario Administrador
  const adminEmail = 'admin@alfadark.com';
  const adminPassword = await bcrypt.hash('Admin123456', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPassword,
      role: 'ADMIN',
      name: 'Admin',
      lastname: 'AlfaDark'
    },
    create: {
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
      name: 'Admin',
      lastname: 'AlfaDark'
    }
  });

  console.log(`✅ Admin user ensured: ${adminUser.email}`);

  // 2. Crear las Categorías Solicitadas
  const categories = [
    { name: 'Anillos', slug: 'anillos' },
    { name: 'Collares', slug: 'collares' },
    { name: 'Pulseras', slug: 'pulseras' },
    { name: 'Aretes', slug: 'aretes' },
    { name: 'Dijes', slug: 'dijes' },
    { name: 'Relojes', slug: 'relojes' },
    { name: 'Colecciones Exclusivas', slug: 'colecciones-exclusivas' },
    { name: 'Oro 18K', slug: 'oro-18k' },
    { name: 'Plata 925', slug: 'plata-925' },
    { name: 'Edición Limitada', slug: 'edicion-limitada' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: `Categoría oficial para ${cat.name}`,
      }
    });
  }

  console.log('✅ Categories successfully seeded.');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
