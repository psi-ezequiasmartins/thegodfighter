-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 22, 2026 at 07:12 PM
-- Server version: 8.0.45
-- PHP Version: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `thegodfighter_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `event_date` datetime NOT NULL,
  `status` enum('open','live','closed') DEFAULT 'open'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `event_date`, `status`) VALUES
(1, 'UFC 320 - Teste', '2026-08-22 11:28:49', 'open'),
(2, 'UFC 321 TESTE', '2026-08-22 19:00:00', 'open');

-- --------------------------------------------------------

--
-- Table structure for table `fights`
--

CREATE TABLE `fights` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `athlete1_name` varchar(100) NOT NULL,
  `athlete2_name` varchar(100) NOT NULL,
  `locked` tinyint(1) DEFAULT '0',
  `winner_name` varchar(100) DEFAULT NULL,
  `winner_round` int DEFAULT NULL,
  `winner_method` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fights`
--

INSERT INTO `fights` (`id`, `event_id`, `athlete1_name`, `athlete2_name`, `locked`, `winner_name`, `winner_round`, `winner_method`) VALUES
(1, 1, 'Topuria', 'Oliveira', 1, 'Oliveira', 2, 'Finalização'),
(2, 1, 'Terremoto', 'Oliveira', 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `predictions`
--

CREATE TABLE `predictions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `fight_id` int NOT NULL,
  `predicted_winner_name` varchar(100) DEFAULT NULL,
  `predicted_round` int DEFAULT NULL,
  `predicted_method` varchar(50) DEFAULT NULL,
  `points` int DEFAULT '0',
  `is_correct` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `predictions`
--

INSERT INTO `predictions` (`id`, `user_id`, `fight_id`, `predicted_winner_name`, `predicted_round`, `predicted_method`, `points`, `is_correct`, `created_at`) VALUES
(1, 1, 1, 'Oliveira', 2, 'Decisão', 8, 1, '2026-08-22 16:19:07'),
(7, 1, 2, 'Terremoto', 2, 'Finalização', 0, 0, '2026-08-22 16:20:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `phone` varchar(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `role` enum('fan','athlete','admin') DEFAULT 'fan',
  `verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `phone`, `name`, `role`, `verified`, `created_at`) VALUES
(1, '31984107540', 'Ezequias Martins', 'admin', 0, '2026-08-22 14:23:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fights`
--
ALTER TABLE `fights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `predictions`
--
ALTER TABLE `predictions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`fight_id`),
  ADD UNIQUE KEY `unique_user_fight` (`user_id`,`fight_id`),
  ADD KEY `fight_id` (`fight_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `fights`
--
ALTER TABLE `fights`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `predictions`
--
ALTER TABLE `predictions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fights`
--
ALTER TABLE `fights`
  ADD CONSTRAINT `fights_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Constraints for table `predictions`
--
ALTER TABLE `predictions`
  ADD CONSTRAINT `predictions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `predictions_ibfk_2` FOREIGN KEY (`fight_id`) REFERENCES `fights` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
