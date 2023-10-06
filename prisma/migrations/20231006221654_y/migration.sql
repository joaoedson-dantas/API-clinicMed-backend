/*
  Warnings:

  - Added the required column `specialty` to the `queries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "queries" ADD COLUMN     "specialty" TEXT NOT NULL;
