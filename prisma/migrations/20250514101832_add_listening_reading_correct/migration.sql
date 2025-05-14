/*
  Warnings:

  - You are about to drop the column `flow` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "flow",
ADD COLUMN     "isFullTest" BOOLEAN NOT NULL DEFAULT false;
