/*
  Warnings:

  - Added the required column `totalPrice` to the `Checkout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalQuantity` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "bottomBoxColor" TEXT DEFAULT 'red',
ADD COLUMN     "bottomBoxPhrase" TEXT DEFAULT 'Frase de contagem ativa!',
ADD COLUMN     "topBoxColor" TEXT DEFAULT 'green',
ADD COLUMN     "topBoxPhrase" TEXT DEFAULT 'Pagamento Priorizado!',
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalQuantity" INTEGER NOT NULL;
