/*
  Warnings:

  - Made the column `end_time` on table `queries` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "queries" ALTER COLUMN "end_time" SET NOT NULL;
