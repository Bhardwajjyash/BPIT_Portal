/*
  Warnings:

  - You are about to drop the column `department` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `Faculty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Admin` DROP COLUMN `department`,
    ADD COLUMN `departmentName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Faculty` DROP COLUMN `department`,
    ADD COLUMN `departmentName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Student` ADD COLUMN `departmentName` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Department` (
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Faculty` ADD CONSTRAINT `Faculty_departmentName_fkey` FOREIGN KEY (`departmentName`) REFERENCES `Department`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_departmentName_fkey` FOREIGN KEY (`departmentName`) REFERENCES `Department`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_departmentName_fkey` FOREIGN KEY (`departmentName`) REFERENCES `Department`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;
