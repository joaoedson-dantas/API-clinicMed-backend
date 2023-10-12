/*
  Warnings:

  - Made the column `specialty` on table `doctors` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "specialty" SET NOT NULL;
