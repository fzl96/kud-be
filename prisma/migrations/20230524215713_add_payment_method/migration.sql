-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('SELESAI', 'PROSES', 'BATAL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TUNAI', 'KREDIT');

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'TUNAI',
ADD COLUMN     "status" "SaleStatus" NOT NULL DEFAULT 'SELESAI',
ALTER COLUMN "cash" DROP NOT NULL,
ALTER COLUMN "change" DROP NOT NULL;
