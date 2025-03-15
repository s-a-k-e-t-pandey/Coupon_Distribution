import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdmin() {
  try{
    const hashedPassword = await bcrypt.hash('admin123', 10); 

    await prisma.admin.create({
        data: {
        email: 'saketpandey@gmail.com',
        password: hashedPassword,
        name: 'Saket Pandey',
        },
    });
    console.log('Admin seeded successfully');
    }catch{
        console.error('Admin already seeded');
    }
}

seedAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });