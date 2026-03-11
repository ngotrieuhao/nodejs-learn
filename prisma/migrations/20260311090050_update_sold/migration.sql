/*
  Warnings:

  - You are about to drop the column `detailDesc` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `shortDesc` on the `products` table. All the data in the column will be lost.
  - Added the required column `description` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `detailDesc`,
    DROP COLUMN `shortDesc`,
    ADD COLUMN `description` VARCHAR(255) NOT NULL,
    ADD COLUMN `shortDescription` VARCHAR(255) NOT NULL;
