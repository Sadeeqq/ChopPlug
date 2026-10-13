const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Roles
  const adminRole = await prisma.adminRole.upsert({
    where: { name: 'SuperAdmin' },
    update: {},
    create: {
      name: 'SuperAdmin',
      description: 'Super administrator role',
    },
  });

  // User
  const user = await prisma.user.upsert({
    where: { email: 'test@abueats.edu.ng' },
    update: {},
    create: {
      email: 'test@abueats.edu.ng',
      name: 'Test Customer',
      phone: '08000000000',
      passwordHash: 'hashed_password', // Should be properly hashed
      emailVerified: true,
      status: 'ACTIVE'
    },
  });

  // Store
  const zone = await prisma.deliveryZone.create({
    data: {
      name: 'Main Campus',
      description: 'Samaru Main Campus',
    }
  });

  const location = await prisma.campusLocation.create({
    data: {
      name: 'Danfodio Hall',
      zoneId: zone.id
    }
  });

  const store = await prisma.store.create({
    data: {
      ownerId: user.id,
      storeType: 'RESTAURANT',
      name: 'Test Restaurant',
      phone: '08011111111',
      campusLocationId: location.id,
      deliveryZoneId: zone.id,
      status: 'OPEN',
      verificationStatus: 'APPROVED'
    }
  });

  // Category & Product
  const category = await prisma.category.create({
    data: { name: 'Food' }
  });

  const product = await prisma.product.create({
    data: {
      storeId: store.id,
      categoryId: category.id,
      name: 'Jollof Rice',
      price: 1500,
      isAvailable: true
    }
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
