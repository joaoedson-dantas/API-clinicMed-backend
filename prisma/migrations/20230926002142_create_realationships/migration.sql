/*
  Warnings:

  - Added the required column `doctorId` to the `queries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `queries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "queries" ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "reason_cancellation" TEXT;

-- AddForeignKey
ALTER TABLE "queries" ADD CONSTRAINT "queries_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queries" ADD CONSTRAINT "queries_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
