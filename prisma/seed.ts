import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding local sandbox database...');

  // Roles to seed
  const roles = [
    { email: 'admin@local.test', role: 'ADMIN', firstName: 'Alice', lastName: 'Admin' },
    { email: 'manager@local.test', role: 'MANAGER', firstName: 'Mike', lastName: 'Manager' },
    { email: 'closer@local.test', role: 'CLOSER', firstName: 'Chris', lastName: 'Closer' },
    { email: 'setter@local.test', role: 'SETTER', firstName: 'Sarah', lastName: 'Setter' },
  ];

  const defaultPassword = 'password123';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  for (const r of roles) {
    const username = r.email.split('@')[0];
    const user = await prisma.user.upsert({
      where: { email: r.email },
      update: {
        role: r.role,
        firstName: r.firstName,
        lastName: r.lastName,
        username,
      },
      create: {
        email: r.email,
        username,
        role: r.role,
        firstName: r.firstName,
        lastName: r.lastName,
        passwordHash, // Even mock accounts should have a hash
      },
    });
    console.log(`[SEED] Upserted user: ${user.email} (${user.role})`);
  }

  // Provision the first production user as ADMIN if desired
  const prodAdminEmail = 'prod-admin@example.com';
  const prodUser = await prisma.user.upsert({
    where: { email: prodAdminEmail },
    update: { role: 'ADMIN', username: 'prodadmin' },
    create: {
      email: prodAdminEmail,
      username: 'prodadmin',
      role: 'ADMIN',
      firstName: 'Production',
      lastName: 'Admin',
      passwordHash
    }
  });
  console.log(`[SEED] Production Admin provisioned: ${prodUser.email}`);

  console.log('Sandbox database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
