/*
  Warnings:

  - Added the required column `id_mercado_pago` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `id_mercado_pago` VARCHAR(191) NOT NULL;
