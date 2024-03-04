/*
  Warnings:

  - Added the required column `currency` to the `RideAmountConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RideAmountConfig" ADD COLUMN     "currency" TEXT NOT NULL;
