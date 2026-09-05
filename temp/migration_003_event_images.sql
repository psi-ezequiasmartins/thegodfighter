-- Migração 003: imagem de capa para eventos (fighters já tem photo_url)

START TRANSACTION;

ALTER TABLE `events`
  ADD COLUMN `image_url` varchar(255) DEFAULT NULL AFTER `status`;

COMMIT;
