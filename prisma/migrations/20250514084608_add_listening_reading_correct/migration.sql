/*
  Warnings:

  - You are about to drop the column `score` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "score",
ADD COLUMN     "listeningCorrect" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nameTest" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "readingCorrect" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalListening" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalReading" INTEGER NOT NULL DEFAULT 0;
