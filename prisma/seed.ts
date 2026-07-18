import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed a test user with mobile auth
  const testUser = await prisma.user.upsert({
    where: { mobile: "+919999999999" },
    update: {},
    create: {
      name: "Test User",
      mobile: "+919999999999",
      gender: "male",
      dob: new Date("1990-01-01"),
      profileSetup: true,
    },
  });

  console.log("Seeded test user:", testUser.id, testUser.mobile);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
