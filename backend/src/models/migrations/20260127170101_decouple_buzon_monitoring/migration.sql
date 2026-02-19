/*
  Warnings:

  - You are about to drop the column `monitorearBuzon` on the `clienteprov` table. All the data in the column will be lost.
  - You are about to drop the `buzonmensaje` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `buzonmensaje` DROP FOREIGN KEY `buzonmensaje_idclienteprov_fkey`;

-- AlterTable
ALTER TABLE `clienteprov` DROP COLUMN `monitorearBuzon`;

-- DropTable
DROP TABLE `buzonmensaje`;

-- CreateTable
CREATE TABLE `monitoreo_buzon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idclienteprov` VARCHAR(191) NOT NULL,
    `fecha_inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `monitoreo_buzon_idclienteprov_key`(`idclienteprov`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monitoreo_mensaje` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idclienteprov` VARCHAR(191) NOT NULL,
    `mensajeId` VARCHAR(191) NOT NULL,
    `asunto` TEXT NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `tag` VARCHAR(191) NULL,
    `leido` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `monitoreo_mensaje_mensajeId_key`(`mensajeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
