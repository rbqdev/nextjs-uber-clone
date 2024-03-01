/*
  Warnings:

  - Changed the type of `status` on the `RideOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `avatarUrl` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RideOrderStatus" AS ENUM ('SEARCHING', 'ACCEPTED', 'ONBOARD', 'COMPLETED');

-- AlterTable
ALTER TABLE "RideOrder" DROP COLUMN "status",
ADD COLUMN     "status" "RideOrderStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- DropEnum
DROP TYPE "OrderStatus";
