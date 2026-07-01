/**
 * Seed script — creates a demo user and baseline data so the app is usable
 * immediately after `npm run db:seed`.
 *
 * Demo credentials: demo@trade247.local / Demo1234!
 * (Change or remove before any production deployment.)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@trade247.local";
  const passwordHash = await bcrypt.hash("Demo1234!", 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Demo Investor",
      passwordHash,
      settings: { create: { whatsappEnabled: false, minConfidenceScore: 70 } },
      portfolios: { create: { name: "Main Portfolio", cashBalance: 18320.5 } },
      watchlists: {
        create: [
          { name: "High Conviction", isDefault: true },
          { name: "Crypto" },
        ],
      },
    },
  });

  console.log(`Seeded demo user: ${user.email} (password: Demo1234!)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
