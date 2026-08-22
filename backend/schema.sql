-- The Godfighter DB Schema v1.0
USE `thegodfighter_db`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(20) UNIQUE NOT NULL,
  `name` VARCHAR(100),
  `role` ENUM('fan','athlete','admin') DEFAULT 'fan',
  `verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `event_date` DATETIME NOT NULL,
  `status` ENUM('open','live','closed') DEFAULT 'open'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `fights` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `athlete1_name` VARCHAR(100) NOT NULL,
  `athlete2_name` VARCHAR(100) NOT NULL,
  `result_winner_name` VARCHAR(100) NULL,
  `result_round` INT NULL,
  `result_method` VARCHAR(50) NULL,
  `locked` TINYINT(1) DEFAULT 0,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `predictions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `fight_id` INT NOT NULL,
  `predicted_winner_name` VARCHAR(100),
  `predicted_round` INT,
  `predicted_method` VARCHAR(50),
  `points` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(`user_id`, `fight_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`fight_id`) REFERENCES `fights`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;