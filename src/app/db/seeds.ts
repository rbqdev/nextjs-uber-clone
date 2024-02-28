const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Delete all data first
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  // Create two core users
  await prisma.user.createMany({
    data: [
      {
        name: "Rider Test #1",
        email: "rider@email.com",
        type: "RIDER",
      },
      {
        name: "Goober Driver",
        email: "driver@email.com",
        type: "DRIVER",
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
