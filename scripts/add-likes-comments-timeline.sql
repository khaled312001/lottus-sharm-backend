-- CreateTable
CREATE TABLE `TripLike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tripId` INTEGER NOT NULL,
    `visitorId` VARCHAR(80) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TripLike_tripId_idx`(`tripId`),
    UNIQUE INDEX `TripLike_tripId_visitorId_key`(`tripId`, `visitorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TripComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tripId` INTEGER NOT NULL,
    `authorName` VARCHAR(120) NOT NULL,
    `authorEmail` VARCHAR(255) NULL,
    `content` TEXT NOT NULL,
    `locale` ENUM('AR', 'EN', 'RU', 'IT') NOT NULL DEFAULT 'AR',
    `isApproved` BOOLEAN NOT NULL DEFAULT true,
    `visitorId` VARCHAR(80) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TripComment_tripId_isApproved_idx`(`tripId`, `isApproved`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TripTimelineStep` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tripId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `time` VARCHAR(10) NULL,
    `icon` VARCHAR(40) NULL,

    INDEX `TripTimelineStep_tripId_idx`(`tripId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TripTimelineStepTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stepId` INTEGER NOT NULL,
    `locale` ENUM('AR', 'EN', 'RU', 'IT') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `desc` TEXT NULL,

    UNIQUE INDEX `TripTimelineStepTranslation_stepId_locale_key`(`stepId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TripLike` ADD CONSTRAINT `TripLike_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `Trip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TripComment` ADD CONSTRAINT `TripComment_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `Trip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TripTimelineStep` ADD CONSTRAINT `TripTimelineStep_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `Trip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TripTimelineStepTranslation` ADD CONSTRAINT `TripTimelineStepTranslation_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `TripTimelineStep`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

