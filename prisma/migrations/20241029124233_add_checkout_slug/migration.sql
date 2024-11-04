/*
  Warnings:

  - Added the required column `conversions` to the `Checkout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impressions` to the `Checkout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Checkout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "color" TEXT,
    "banner" TEXT,
    "impressions" INTEGER NOT NULL,
    "conversions" INTEGER NOT NULL,
    "model" TEXT DEFAULT 'Sunize',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Checkout_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Checkout" ("createdAt", "hash", "id", "productId", "updatedAt") SELECT "createdAt", "hash", "id", "productId", "updatedAt" FROM "Checkout";
DROP TABLE "Checkout";
ALTER TABLE "new_Checkout" RENAME TO "Checkout";
CREATE UNIQUE INDEX "Checkout_hash_key" ON "Checkout"("hash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
