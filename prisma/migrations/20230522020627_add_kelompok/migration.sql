-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ANGGOTA', 'KETUA');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "kelompokId" TEXT,
ADD COLUMN     "memberRole" "MemberRole" NOT NULL DEFAULT 'ANGGOTA';

-- CreateTable
CREATE TABLE "Kelompok" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kelompok_name_key" ON "Kelompok"("name");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_kelompokId_fkey" FOREIGN KEY ("kelompokId") REFERENCES "Kelompok"("id") ON DELETE SET NULL ON UPDATE CASCADE;
