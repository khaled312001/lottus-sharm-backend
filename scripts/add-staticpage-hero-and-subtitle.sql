-- Add hero image + subtitle support to StaticPage / StaticPageTranslation
-- Safe: additive only, no DROP / no data loss.

ALTER TABLE `StaticPage`
  ADD COLUMN `heroImageId` INTEGER NULL,
  ADD CONSTRAINT `StaticPage_heroImageId_fkey`
    FOREIGN KEY (`heroImageId`) REFERENCES `Media`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `StaticPageTranslation`
  ADD COLUMN `subtitle` VARCHAR(500) NULL;
