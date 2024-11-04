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
    "redirectLink" TEXT,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "model" TEXT DEFAULT 'sunize',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Checkout_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Checkout" ("banner", "color", "conversions", "createdAt", "hash", "id", "impressions", "model", "productId", "redirectLink", "slug", "updatedAt") SELECT "banner", "color", "conversions", "createdAt", "hash", "id", "impressions", "model", "productId", "redirectLink", "slug", "updatedAt" FROM "Checkout";
DROP TABLE "Checkout";
ALTER TABLE "new_Checkout" RENAME TO "Checkout";
CREATE UNIQUE INDEX "Checkout_hash_key" ON "Checkout"("hash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
