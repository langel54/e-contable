-- AlterTable
ALTER TABLE `clienteprov` ADD COLUMN `monitorearBuzon` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `buzonmensaje` (
    `idbuzon` INTEGER NOT NULL AUTO_INCREMENT,
    `idclienteprov` VARCHAR(191) NOT NULL,
    `mensajeId` VARCHAR(191) NOT NULL,
    `asunto` TEXT NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `tag` VARCHAR(191) NULL,
    `leido` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `buzonmensaje_mensajeId_key`(`mensajeId`),
    PRIMARY KEY (`idbuzon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `buzonmensaje` ADD CONSTRAINT `buzonmensaje_idclienteprov_fkey` FOREIGN KEY (`idclienteprov`) REFERENCES `clienteprov`(`idclienteprov`) ON DELETE RESTRICT ON UPDATE CASCADE;
