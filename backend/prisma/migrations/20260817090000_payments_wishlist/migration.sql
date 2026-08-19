-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYONEER', 'CARD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'REQUIRES_ACTION', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AUD',
    "providerRef" TEXT,
    "checkoutUrl" TEXT,
    "failureReason" TEXT,
    "metadata" JSONB,
    "cardBrand" TEXT,
    "cardLast4" TEXT,
    "cardExpMonth" INTEGER,
    "cardExpYear" INTEGER,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wishlist_items_userId_createdAt_idx" ON "wishlist_items"("userId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_userId_courseId_key" ON "wishlist_items"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_reference_key" ON "payments"("reference");

-- CreateIndex
CREATE INDEX "payments_userId_createdAt_idx" ON "payments"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "payments_providerRef_idx" ON "payments"("providerRef");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
