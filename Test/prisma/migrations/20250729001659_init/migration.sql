/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Items` (
    `itemId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `itemStat` JSON NULL,
    `itemPrice` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isEquip` BOOLEAN NOT NULL DEFAULT true,
    `itemType` ENUM('HEAD', 'BODY', 'WEAPON', 'SHIELD', 'RING', 'NECKLACE', 'CONSUMABLE') NOT NULL DEFAULT 'WEAPON',

    PRIMARY KEY (`itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `accountId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `refreshToken` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_userId_key`(`userId`),
    PRIMARY KEY (`accountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Character` (
    `characterId` INTEGER NOT NULL AUTO_INCREMENT,
    `accountId` INTEGER NOT NULL,
    `charactername` VARCHAR(191) NOT NULL,
    `health` INTEGER NOT NULL,
    `power` INTEGER NOT NULL,
    `money` INTEGER NOT NULL,
    `profileImage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Character_charactername_key`(`charactername`),
    INDEX `Character_accountId_fkey`(`accountId`),
    PRIMARY KEY (`characterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryItem` (
    `inventoryItemId` INTEGER NOT NULL AUTO_INCREMENT,
    `characterId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    INDEX `InventoryItem_itemId_fkey`(`itemId`),
    UNIQUE INDEX `InventoryItem_characterId_itemId_key`(`characterId`, `itemId`),
    PRIMARY KEY (`inventoryItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EquippedItem` (
    `equippedItemId` INTEGER NOT NULL AUTO_INCREMENT,
    `characterId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `slot` ENUM('HEAD', 'BODY', 'WEAPON', 'SHIELD', 'RING', 'NECKLACE', 'CONSUMABLE') NOT NULL,

    INDEX `EquippedItem_itemId_fkey`(`itemId`),
    UNIQUE INDEX `EquippedItem_characterId_slot_key`(`characterId`, `slot`),
    PRIMARY KEY (`equippedItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`accountId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`characterId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Items`(`itemId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EquippedItem` ADD CONSTRAINT `EquippedItem_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`characterId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EquippedItem` ADD CONSTRAINT `EquippedItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Items`(`itemId`) ON DELETE CASCADE ON UPDATE CASCADE;
