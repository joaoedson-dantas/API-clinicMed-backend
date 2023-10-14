/*
  Warnings:

  - The `reason_cancellation` column on the `queries` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `specialty` on the `queries` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Cancellation" AS ENUM ('PACIENTE_DESISTIU', 'MEDICO_CANCELOU', 'OUTROS');

-- AlterTable
ALTER TABLE "queries" DROP COLUMN "reason_cancellation",
ADD COLUMN     "reason_cancellation" "Cancellation",
DROP COLUMN "specialty",
ADD COLUMN     "specialty" "Specialty" NOT NULL;
