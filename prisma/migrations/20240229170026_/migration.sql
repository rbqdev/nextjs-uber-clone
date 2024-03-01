/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceConfigs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "PriceConfigs";

-- CreateTable
CREATE TABLE "RidePrices" (
    "id" SERIAL NOT NULL,
    "minimumPrice" INTEGER NOT NULL,
    "pricePerMeters" INTEGER NOT NULL,
    "countryAlpha2" TEXT NOT NULL,

    CONSTRAINT "RidePrices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RideOrder" (
    "id" SERIAL NOT NULL,
    "userRiderId" INTEGER NOT NULL,
    "userDriverId" INTEGER,
    "price" TEXT NOT NULL,
    "distance" JSONB NOT NULL,
    "duration" JSONB NOT NULL,
    "source" JSONB NOT NULL,
    "destination" JSONB NOT NULL,
    "status" "OrderStatus" NOT NULL,

    CONSTRAINT "RideOrder_pkey" PRIMARY KEY ("id")
);
