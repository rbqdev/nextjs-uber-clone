/*
  Warnings:

  - You are about to drop the `RideOrder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `driverPercentage` to the `RidePrices` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RideRequestStatus" AS ENUM ('SEARCHING', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "RidePrices" ADD COLUMN     "driverPercentage" INTEGER NOT NULL;

-- DropTable
DROP TABLE "RideOrder";

-- DropEnum
DROP TYPE "RideOrderStatus";

-- CreateTable
CREATE TABLE "RideRequest" (
    "id" SERIAL NOT NULL,
    "riderId" INTEGER NOT NULL,
    "driverId" INTEGER,
    "price" TEXT NOT NULL,
    "distance" JSONB NOT NULL,
    "duration" JSONB NOT NULL,
    "source" JSONB NOT NULL,
    "destination" JSONB NOT NULL,
    "status" "RideRequestStatus" NOT NULL,

    CONSTRAINT "RideRequest_pkey" PRIMARY KEY ("id")
);
