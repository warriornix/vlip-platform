const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin user created');

  // Create Manager User
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      password: managerPassword,
      name: 'Fleet Manager',
      role: 'MANAGER'
    }
  });
  console.log('✅ Manager user created');

  // Create Driver User
  const driverPassword = await bcrypt.hash('driver123', 10);
  const driver = await prisma.user.upsert({
    where: { email: 'driver@example.com' },
    update: {},
    create: {
      email: 'driver@example.com',
      password: driverPassword,
      name: 'John Driver',
      role: 'DRIVER'
    }
  });
  console.log('✅ Driver user created');

  // Create Vehicles for Driver
  await prisma.vehicle.createMany({
    data: [
      {
        name: 'Honda Accord',
        vin: '1HGCM82633A123456',
        manufacturer: 'Honda',
        model: 'Accord',
        year: 2023,
        mileage: 50000,
        userId: driver.id
      },
      {
        name: 'Toyota Camry',
        vin: '2HGCM82633B789012',
        manufacturer: 'Toyota',
        model: 'Camry',
        year: 2024,
        mileage: 35000,
        userId: driver.id
      },
      {
        name: 'Ford Transit',
        vin: '3HGCM82633C345678',
        manufacturer: 'Ford',
        model: 'Transit',
        year: 2022,
        mileage: 75000,
        userId: manager.id
      }
    ]
  });
  console.log('✅ Vehicles created');

  console.log('\n📊 Seeding Summary:');
  console.log(`   Users: 3 (Admin, Manager, Driver)`);
  console.log(`   Vehicles: 3`);
  console.log('\n✅ Seeding completed successfully!');
  console.log('\n🔐 Test Credentials:');
  console.log('   Admin: admin@example.com / admin123');
  console.log('   Manager: manager@example.com / manager123');
  console.log('   Driver: driver@example.com / driver123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });