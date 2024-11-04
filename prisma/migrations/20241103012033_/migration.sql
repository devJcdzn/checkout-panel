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
    CONSTRAINT "Checkout_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Checkout" ("banner", "color", "conversions", "createdAt", "hash", "id", "impressions", "model", "productId", "redirectLink", "slug", "updatedAt") SELECT "banner", "color", "conversions", "createdAt", "hash", "id", "impressions", "model", "productId", "redirectLink", "slug", "updatedAt" FROM "Checkout";
DROP TABLE "Checkout";
ALTER TABLE "new_Checkout" RENAME TO "Checkout";
CREATE UNIQUE INDEX "Checkout_hash_key" ON "Checkout"("hash");
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checkoutId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "expiration" INTEGER NOT NULL,
    "status" TEXT,
    "paymentCode" TEXT,
    "paymentUrl" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerTax" TEXT,
    "transactionId" TEXT,
    "paymentDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "Checkout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "checkoutId", "createdAt", "customerEmail", "customerName", "customerTax", "expiration", "id", "paymentCode", "paymentDate", "paymentUrl", "status", "transactionId") SELECT "amount", "checkoutId", "createdAt", "customerEmail", "customerName", "customerTax", "expiration", "id", "paymentCode", "paymentDate", "paymentUrl", "status", "transactionId" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
