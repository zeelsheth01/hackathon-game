import { prisma } from "../db";

async function main() {
  console.log("Seeding database...");

  // Create dummy users
  const user1 = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      name: "Alice_W",
      hackerId: "HACK-ALICE",
      password: "password123",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      name: "Bob_dev",
      hackerId: "HACK-BOB",
      password: "password123",
    },
  });

  // Create Leaderboard Entries
  await prisma.leaderboard.createMany({
    data: [
      { userId: user1.id, score: 385, rank: 1 },
      { userId: user2.id, score: 310, rank: 2 },
      { userId: user1.id, score: 395, rank: 1 }, // A better run
      { userId: user2.id, score: 250, rank: 3 },
    ],
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

