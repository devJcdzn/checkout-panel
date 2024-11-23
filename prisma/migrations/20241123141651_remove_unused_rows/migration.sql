/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Checkout` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuantity` on the `Checkout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Checkout" DROP COLUMN "totalPrice",
DROP COLUMN "totalQuantity";
