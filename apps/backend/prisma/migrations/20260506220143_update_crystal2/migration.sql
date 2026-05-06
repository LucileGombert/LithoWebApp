/*
  Warnings:

  - The `purification` column on the `Crystal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rechargement` column on the `Crystal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Crystal" DROP COLUMN "purification",
ADD COLUMN     "purification" TEXT[],
DROP COLUMN "rechargement",
ADD COLUMN     "rechargement" TEXT[];
