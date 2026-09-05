-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 05/09/2026 às 17:25
-- Versão do servidor: 8.0.45
-- Versão do PHP: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `thegodfighter`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `event_date` datetime NOT NULL,
  `status` enum('open','live','closed') DEFAULT 'open',
  `fights_count` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `events`
--

INSERT INTO `events` (`id`, `name`, `event_date`, `status`, `fights_count`) VALUES
(1, 'The God Fighter - Edição 01', '2026-07-15 11:28:49', 'open', 12),
(2, 'UFC 319 - Edição 98        ', '2026-07-21 19:00:00', 'open', 8),
(3, 'UFC 320 - Edição 99        ', '2026-08-15 19:00:00', 'closed', 10);

-- --------------------------------------------------------

--
-- Estrutura para tabela `fights`
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
-- Despejando dados para a tabela `fights`
--

INSERT INTO `fights` (`id`, `event_id`, `athlete1_name`, `athlete2_name`, `locked`, `winner_name`, `winner_round`, `winner_method`) VALUES
(1, 1, 'Topuria', 'Oliveira', 1, 'Oliveira', 2, 'Finalização'),
(2, 1, 'Terremoto', 'Oliveira', 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `predictions`
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
-- Despejando dados para a tabela `predictions`
--

INSERT INTO `predictions` (`id`, `user_id`, `fight_id`, `predicted_winner_name`, `predicted_round`, `predicted_method`, `points`, `is_correct`, `created_at`) VALUES
(1, 1, 1, 'Oliveira', 2, 'Decisão', 8, 1, '2026-08-22 16:19:07'),
(7, 1, 2, 'Terremoto', 2, 'Finalização', 0, 0, '2026-08-22 16:20:42');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
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
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `phone`, `name`, `role`, `verified`, `created_at`) VALUES
(1, '31984107540', 'Ezequias Martins', 'admin', 0, '2026-08-22 14:23:52');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `fights`
--
ALTER TABLE `fights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Índices de tabela `predictions`
--
ALTER TABLE `predictions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`fight_id`),
  ADD UNIQUE KEY `unique_user_fight` (`user_id`,`fight_id`),
  ADD KEY `fight_id` (`fight_id`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `fights`
--
ALTER TABLE `fights`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `predictions`
--
ALTER TABLE `predictions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `fights`
--
ALTER TABLE `fights`
  ADD CONSTRAINT `fights_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Restrições para tabelas `predictions`
--
ALTER TABLE `predictions`
  ADD CONSTRAINT `predictions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `predictions_ibfk_2` FOREIGN KEY (`fight_id`) REFERENCES `fights` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
