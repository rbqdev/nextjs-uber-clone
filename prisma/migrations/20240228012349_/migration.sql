/*
  Warnings:

  - You are about to drop the `Configs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Configs";

-- CreateTable
CREATE TABLE "PriceConfigs" (
    "id" SERIAL NOT NULL,
    "minimumPrice" INTEGER NOT NULL,
    "pricePerMeters" INTEGER NOT NULL,

    CONSTRAINT "PriceConfigs_pkey" PRIMARY KEY ("id")
);
