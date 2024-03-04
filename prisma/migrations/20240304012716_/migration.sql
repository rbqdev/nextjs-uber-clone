/*
  Warnings:

  - You are about to drop the column `price` on the `RideRequest` table. All the data in the column will be lost.
  - You are about to drop the `RidePrices` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `RideRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RideRequest" DROP COLUMN "price",
ADD COLUMN     "amount" TEXT NOT NULL;

-- DropTable
DROP TABLE "RidePrices";

-- CreateTable
CREATE TABLE "RideAmountConfig" (
    "id" SERIAL NOT NULL,
    "minimumAmount" INTEGER NOT NULL,
    "percentagePerMeters" INTEGER NOT NULL,
    "driverPercentage" INTEGER NOT NULL,
    "countryLocale" TEXT NOT NULL,
    "countryAlpha2" TEXT NOT NULL,

    CONSTRAINT "RideAmountConfig_pkey" PRIMARY KEY ("id")
);
