-- Migração 002: cria tabela `fighters` e substitui nomes-texto por FKs
-- Padronização: "athlete" -> "fighter" no schema e no código (inglês).
-- Pode ser executada sobre o dump em temp/thegodfighter.sql.

START TRANSACTION;

-- 1) Tabela de lutadores (perfis)
CREATE TABLE IF NOT EXISTS `fighters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `weight_class` varchar(50) DEFAULT NULL,
  `wins` int DEFAULT '0',
  `losses` int DEFAULT '0',
  `draws` int DEFAULT '0',
  `photo_url` varchar(255) DEFAULT NULL,
  `bio` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_fighter_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2) Popular fighters com os nomes já usados em fights/predictions
INSERT IGNORE INTO `fighters` (`name`)
SELECT DISTINCT athlete1_name FROM fights WHERE athlete1_name IS NOT NULL
UNION
SELECT DISTINCT athlete2_name FROM fights WHERE athlete2_name IS NOT NULL
UNION
SELECT DISTINCT winner_name FROM fights WHERE winner_name IS NOT NULL
UNION
SELECT DISTINCT predicted_winner_name FROM predictions WHERE predicted_winner_name IS NOT NULL;

-- 3) fights: adicionar colunas de FK
ALTER TABLE `fights`
  ADD COLUMN `fighter1_id` int DEFAULT NULL AFTER `event_id`,
  ADD COLUMN `fighter2_id` int DEFAULT NULL AFTER `fighter1_id`,
  ADD COLUMN `weight_class` varchar(50) DEFAULT NULL AFTER `fighter2_id`,
  ADD COLUMN `winner_fighter_id` int DEFAULT NULL AFTER `winner_name`;

UPDATE fights f JOIN fighters ft ON ft.name = f.athlete1_name SET f.fighter1_id = ft.id;
UPDATE fights f JOIN fighters ft ON ft.name = f.athlete2_name SET f.fighter2_id = ft.id;
UPDATE fights f JOIN fighters ft ON ft.name = f.winner_name SET f.winner_fighter_id = ft.id;

ALTER TABLE `fights`
  MODIFY `fighter1_id` int NOT NULL,
  MODIFY `fighter2_id` int NOT NULL,
  ADD CONSTRAINT `fights_fighter1_fk` FOREIGN KEY (`fighter1_id`) REFERENCES `fighters` (`id`),
  ADD CONSTRAINT `fights_fighter2_fk` FOREIGN KEY (`fighter2_id`) REFERENCES `fighters` (`id`),
  ADD CONSTRAINT `fights_winner_fighter_fk` FOREIGN KEY (`winner_fighter_id`) REFERENCES `fighters` (`id`),
  DROP COLUMN `athlete1_name`,
  DROP COLUMN `athlete2_name`,
  DROP COLUMN `winner_name`;

-- 4) predictions: adicionar coluna de FK
ALTER TABLE `predictions`
  ADD COLUMN `predicted_winner_fighter_id` int DEFAULT NULL AFTER `fight_id`;

UPDATE predictions p JOIN fighters ft ON ft.name = p.predicted_winner_name
  SET p.predicted_winner_fighter_id = ft.id;

ALTER TABLE `predictions`
  ADD CONSTRAINT `predictions_winner_fighter_fk` FOREIGN KEY (`predicted_winner_fighter_id`) REFERENCES `fighters` (`id`),
  DROP COLUMN `predicted_winner_name`;

COMMIT;
