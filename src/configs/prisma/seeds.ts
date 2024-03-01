const { prisma } = require("./index");

async function main() {
  // Delete all data first
  // await prisma.rideOrder.deleteMany();
  // await prisma.driver.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.user.createMany({
  //   data: [
  //     {
  //       name: "Goober Rider",
  //       email: "rider@email.com",
  //       type: "RIDER",
  //       avatarUrl:
  //         "https://img.freepik.com/fotos-gratis/foto-de-close-up-de-um-jovem-barbudo-encantador-encantado-com-bigode-nos-oculos-e-gorro-preto-da-moda-sorrindo-alegremente-e-rindo-sentindo-se-satisfeito-e-com-sorte_176420-23530.jpg",
  //     },
  //     {
  //       name: "Goober Driver",
  //       email: "driver@email.com",
  //       type: "DRIVER",
  //       avatarUrl:
  //         "https://img.freepik.com/fotos-gratis/homem-retrato-rindo_23-2148859448.jpg",
  //     },
  //   ],
  // });
  // const driver = await prisma.user.findFirst({
  //   where: { email: "driver@email.com" },
  // });
  // await prisma.driver.create({
  //   data: {
  //     userId: driver.id,
  //     carName: "Honda Civic",
  //     carColor: "Black",
  //   },
  // });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
