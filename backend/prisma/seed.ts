import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword1 = await bcrypt.hash("user123", 10);
  const hashedPassword2 = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "testuser@vlip.com" },
    update: {},
    create: { email: "testuser@vlip.com", password: hashedPassword1, role: "user" }
  });

  await prisma.user.upsert({
    where: { email: "admin@vlip.com" },
    update: {},
    create: { email: "admin@vlip.com", password: hashedPassword2, role: "admin" }
  });

  console.log("✅ Seeded test users: testuser@vlip.com / user123, admin@vlip.com / admin123");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
