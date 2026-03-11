/*
  Warnings:

  - Made the column `accountType` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `accountType` VARCHAR(50) NOT NULL;
