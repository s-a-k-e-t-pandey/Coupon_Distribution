/*
  Warnings:

  - You are about to drop the column `isClaimed` on the `Coupon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "isClaimed",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
