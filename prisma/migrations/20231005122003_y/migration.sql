/*
  Warnings:

  - The `activated` column on the `doctors` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `activated` column on the `patients` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "activated",
ADD COLUMN     "activated" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "activated",
ADD COLUMN     "activated" BOOLEAN NOT NULL DEFAULT true;
