-- CreateEnum
CREATE TYPE "MockTestKind" AS ENUM ('MOCK_TEST', 'INTERVIEW');

-- CreateTable
CREATE TABLE "mock_tests" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "kind" "MockTestKind" NOT NULL DEFAULT 'MOCK_TEST',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT NOT NULL DEFAULT 'Nepali',
    "category" TEXT NOT NULL DEFAULT 'general',
    "level" TEXT NOT NULL DEFAULT 'All Levels',
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "pdfUrl" TEXT,
    "pdfName" TEXT,
    "pdfSize" INTEGER,
    "mediaUrl" TEXT,
    "mediaName" TEXT,
    "mediaSize" INTEGER,
    "mediaMimeType" TEXT,
    "durationSeconds" DOUBLE PRECISION,
    "publishedAt" TIMESTAMP(3),
    "contentUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "mock_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_test_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mockTestId" TEXT NOT NULL,
    "recordingUrl" TEXT,
    "recordingSize" INTEGER,
    "durationSeconds" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mock_test_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mock_tests_status_language_category_idx" ON "mock_tests"("status", "language", "category");

-- CreateIndex
CREATE INDEX "mock_tests_status_sortOrder_idx" ON "mock_tests"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "mock_tests_slug_locale_key" ON "mock_tests"("slug", "locale");

-- CreateIndex
CREATE INDEX "mock_test_attempts_userId_createdAt_idx" ON "mock_test_attempts"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "mock_test_attempts_mockTestId_idx" ON "mock_test_attempts"("mockTestId");

-- AddForeignKey
ALTER TABLE "mock_test_attempts" ADD CONSTRAINT "mock_test_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_test_attempts" ADD CONSTRAINT "mock_test_attempts_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
