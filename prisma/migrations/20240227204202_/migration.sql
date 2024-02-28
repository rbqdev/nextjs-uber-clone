-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('RIDER', 'DRIVER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('SEARCHING', 'ACCEPTED', 'ONBOARD', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "type" "UserType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userRiderId" INTEGER NOT NULL,
    "userDriverId" INTEGER,
    "price" TEXT NOT NULL,
    "distance" JSONB NOT NULL,
    "duration" JSONB NOT NULL,
    "source" JSONB NOT NULL,
    "destination" JSONB NOT NULL,
    "status" "OrderStatus" NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
