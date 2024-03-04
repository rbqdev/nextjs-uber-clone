const { prisma } = require("./index");

async function main() {
  // Delete all data first
  await prisma.rideRequest.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      {
        name: "Rider #1",
        email: "rider1@email.com",
        type: "RIDER",
        avatarUrl: "https://ui.shadcn.com/avatars/01.png",
      },
      {
        name: "Rider #2",
        email: "rider2@email.com",
        type: "RIDER",
        avatarUrl: "https://ui.shadcn.com/avatars/02.png",
      },
      {
        name: "Driver #1",
        email: "driver1@email.com",
        type: "DRIVER",
        avatarUrl: "https://ui.shadcn.com/avatars/03.png",
      },
      {
        name: "Driver #2",
        email: "driver2@email.com",
        type: "DRIVER",
        avatarUrl: "https://ui.shadcn.com/avatars/04.png",
      },
    ],
  });
  const driver1 = await prisma.user.findFirst({
    where: { email: "driver1@email.com" },
  });
  await prisma.driver.create({
    data: {
      userId: driver1.id,
      carName: "Honda Civic",
      carColor: "White",
    },
  });
  const driver2 = await prisma.user.findFirst({
    where: { email: "driver2@email.com" },
  });
  await prisma.driver.create({
    data: {
      userId: driver2.id,
      carName: "Toyota Corolla",
      carColor: "White",
    },
  });

  await prisma.ridePrices.create({
    data: {
      minimumAmount: 500,
      percentagePerMeters: 1,
      driverPercentage: 70,
      countryLocale: "en-US",
      countryAlpha2: "US",
    },
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
