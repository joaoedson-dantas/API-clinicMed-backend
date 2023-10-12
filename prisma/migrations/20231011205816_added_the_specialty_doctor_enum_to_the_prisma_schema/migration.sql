/*
  Warnings:

  - The `specialty` column on the `doctors` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Specialty" AS ENUM ('CLINICO_GERAL', 'ORTOPEDIA', 'CARDIOLOGIA', 'GINECOLOGIA', 'DERMATOLOGIA');

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "specialty",
ADD COLUMN     "specialty" "Specialty" NOT NULL DEFAULT 'CLINICO_GERAL';
