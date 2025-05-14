/*
  Warnings:

  - You are about to drop the column `nameTest` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "nameTest",
ADD COLUMN     "testName" TEXT NOT NULL DEFAULT '';
