import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from 'path';


const studentBackpackImage = path.join(process.cwd(), 'uploads', 'download.jpg');

const prisma = new PrismaClient();

async function main() {
   const password = "admin123";
   const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            fullName: "admin",
            email: "gigibajadze18@gmail.com",
            password: hashedPassword,
            role: "admin",
            profilePic: ""
        },
    });     

   console.log('🌱 Seeding complete!');
}



main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());