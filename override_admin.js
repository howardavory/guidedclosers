const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function overrideAdmin() {
  const email = 'howard.avory@gmail.com';
  const username = 'howardavory617';
  const password = 'Annabelle32616!';
  const role = 'ADMIN';

  console.log(`Overriding admin credentials for ${username}...`);
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Clear any existing users with this email/username just in case (since we did db push --force-reset, it's empty anyway, but good practice)
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: email },
        { username: username.toLowerCase() }
      ]
    }
  });

  const user = await prisma.user.create({
    data: {
      email,
      username: username.toLowerCase(),
      passwordHash,
      role,
      firstName: 'Howard',
      lastName: 'Avory'
    }
  });

  // Provision workspace for admin to ensure dashboard works
  await prisma.workspace.create({
    data: {
      name: 'Howard Workspace',
      ownerId: user.id
    }
  });

  console.log('✅ Admin Provisioned Successfully!');
  console.log(`Username: ${user.username}`);
  console.log(`Role: ${user.role}`);
}

overrideAdmin()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
