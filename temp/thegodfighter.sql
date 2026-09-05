-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 05/09/2026 às 20:12
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
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `event_date` datetime NOT NULL,
  `status` enum('open','live','closed') COLLATE utf8mb4_general_ci DEFAULT 'open',
  `image_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fights_count` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `events`
--

INSERT INTO `events` (`id`, `name`, `event_date`, `status`, `image_url`, `fights_count`) VALUES
(1, 'The God Fighter - Edição 01', '2026-07-15 17:28:00', 'open', '/uploads/93ab61a35f970660be4aeee1d1e328ad.jpg', 5),
(2, 'UFC 319 - Edição 98', '2026-07-21 22:00:00', 'open', '/uploads/3d922efb541bc37128760cfad8adec36.jpg', 5),
(3, 'UFC 320 - Edição 99', '2026-08-15 22:00:00', 'closed', '/uploads/cf6c2ff05946a8b0980323d70bd91f3a.jpg', 5),
(6, 'The God Fighter - Edição 02', '2026-09-20 23:00:00', 'open', '/uploads/13a07fe2e861772816923baa3d81b17d.jpg', 4),
(7, 'Fury Combat Series 12', '2026-08-30 22:00:00', 'closed', '/uploads/587c326325bbfed652a35848ee157300.jpg', 5),
(8, 'Arena Warriors Cup', '2026-09-06 00:00:00', 'live', '/uploads/61101141e7820c8aece6b0182d1baca8.jpg', 4),
(9, 'Terremoto Fight Night 45', '2026-09-25 23:00:00', 'open', '/uploads/acc9e98ff357d30d0cfa9b4503473683.jpeg', 4),
(10, 'Steel Cage Championship', '2026-07-05 22:00:00', 'closed', '/uploads/51ef4b6728877971a8ea314c65097fe0.jpg', 5),
(11, 'Thunder MMA Grand Prix', '2026-10-05 23:00:00', 'open', '/uploads/48efe7a7c3887aa74cef895a75b489eb.jpeg', 4),
(12, 'Terremoto Arena Combat League 07', '2026-10-20 23:00:00', 'open', '/uploads/9ad281aa335161fc08690389bd77c2d1.jpg', 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `fighters`
--

CREATE TABLE `fighters` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `nickname` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `weight_class` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `wins` int DEFAULT '0',
  `losses` int DEFAULT '0',
  `draws` int DEFAULT '0',
  `photo_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fighters`
--

INSERT INTO `fighters` (`id`, `name`, `nickname`, `weight_class`, `wins`, `losses`, `draws`, `photo_url`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'Topuria', NULL, NULL, 0, 0, 0, '/uploads/f153901cf9c7a03e052dd49efe6ef966.jpg', NULL, '2026-09-05 17:35:23', '2026-09-05 19:50:38'),
(2, 'Terremoto', NULL, NULL, 0, 0, 0, '/uploads/02205439ac80d130d928187b755a4163.jpeg', NULL, '2026-09-05 17:35:23', '2026-09-05 19:48:48'),
(3, 'Oliveira', NULL, NULL, 0, 0, 0, '/uploads/e732598b2f9f507959e0329d34add3c1.jfif', NULL, '2026-09-05 17:35:23', '2026-09-05 19:47:22'),
(22, 'Bruno Alves', 'Falcão', 'Peso Pena', 12, 2, 0, '/uploads/b789c0a74527bf594b3b3cb359e5e77c.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:30:49'),
(23, 'Diego Ramos', 'Trovão', 'Peso Leve', 15, 3, 1, '/uploads/adb0bace08bbe662da7bd697f86b20cf.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:45:03'),
(24, 'Rafael Souza', 'Guerreiro', 'Peso Meio-Médio', 10, 4, 0, '/uploads/789cac9a7936587b60c9128c03a63670.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:47:49'),
(25, 'Lucas Andrade', 'Fúria', 'Peso Médio', 18, 1, 0, '/uploads/57aabf233c253324aed9f061663d7a10.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:46:13'),
(26, 'Marcos Lima', 'Predador', 'Peso Meio-Pesado', 9, 5, 0, '/uploads/faf751fb211cb41e649d5ee4382f2def.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:46:59'),
(27, 'Thiago Cardoso', 'Relâmpago', 'Peso Pesado', 14, 2, 0, '/uploads/3022a08c5231a81c49e5802ada77ef72.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:50:22'),
(28, 'André Pereira', 'Cobra', 'Peso Galo', 11, 3, 1, '/uploads/2c7e4076624b2464a01dbfc3dac49ed4.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:30:34'),
(29, 'Vinícius Teixeira', 'Aço', 'Peso Pena', 8, 6, 0, '/uploads/a5b1d410744e3866a6777d0272829111.jpeg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:51:07'),
(30, 'Gabriel Nunes', 'Furacão', 'Peso Leve', 13, 2, 0, '/uploads/bf5a0c4722f4b94fc947f16abb5386ce.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:35:15'),
(31, 'Pedro Martins', 'Martelo', 'Peso Meio-Médio', 16, 4, 0, '/uploads/cec7f3679907e128992f4a7f182bafeb.jfif', NULL, '2026-09-05 17:55:36', '2026-09-05 19:47:36'),
(32, 'Rodrigo Farias', 'Onça', 'Peso Médio', 7, 3, 0, '/uploads/e74ba127e5e264b3def55c4f22c477ae.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:48:21'),
(33, 'Felipe Duarte', 'Titã', 'Peso Meio-Pesado', 10, 2, 1, '/uploads/a9f6c8d3e01f763a4eee2fb650cb125c.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:46:42'),
(34, 'Gustavo Ribeiro', 'Lâmina', 'Peso Pesado', 6, 1, 0, '/uploads/9c6c75ef91d8dea0a452629fec7b8c00.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:35:37'),
(35, 'Henrique Correia', 'Vulcão', 'Peso Galo', 12, 5, 0, '/uploads/286b50c93cb7844222dfd1093889bd5d.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:36:02'),
(36, 'Leandro Batista', 'Tempestade', 'Peso Pena', 9, 1, 0, '/uploads/e275fb9f175cdbd20314e993ca5b53db.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:45:26'),
(37, 'Mateus Cavalcante', 'Búfalo', 'Peso Leve', 17, 3, 0, '/uploads/cdc55802482f97a02a921ba91f8b450a.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:47:11'),
(38, 'Renato Moreira', 'Espectro', 'Peso Palha', 5, 0, 0, '/uploads/e7417e039463b06e404b40df9c2a6ebc.jpg', NULL, '2026-09-05 17:55:36', '2026-09-05 19:48:03');

-- --------------------------------------------------------

--
-- Estrutura para tabela `fights`
--

CREATE TABLE `fights` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `fighter1_id` int NOT NULL,
  `fighter2_id` int NOT NULL,
  `weight_class` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `locked` tinyint(1) DEFAULT '0',
  `winner_fighter_id` int DEFAULT NULL,
  `winner_round` int DEFAULT NULL,
  `winner_method` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fights`
--

INSERT INTO `fights` (`id`, `event_id`, `fighter1_id`, `fighter2_id`, `weight_class`, `locked`, `winner_fighter_id`, `winner_round`, `winner_method`) VALUES
(1, 1, 1, 3, NULL, 1, 3, 2, 'Finalização'),
(2, 1, 2, 3, NULL, 0, NULL, NULL, NULL),
(4, 1, 22, 23, 'Peso Pena', 0, NULL, NULL, NULL),
(5, 1, 24, 25, 'Peso Meio-Médio', 0, NULL, NULL, NULL),
(6, 1, 26, 27, 'Peso Pesado', 0, NULL, NULL, NULL),
(7, 6, 29, 30, 'Peso Meio-Médio', 0, NULL, NULL, NULL),
(8, 6, 31, 32, 'Peso Médio', 0, NULL, NULL, NULL),
(9, 6, 33, 34, 'Peso Meio-Pesado', 0, NULL, NULL, NULL),
(10, 6, 35, 36, 'Peso Pesado', 0, NULL, NULL, NULL),
(11, 7, 37, 38, 'Peso Palha', 1, 37, 2, 'Decisão'),
(12, 7, 1, 24, 'Peso Meio-Médio', 1, 24, 1, 'KO'),
(13, 7, 2, 28, 'Peso Galo', 1, 2, 3, 'Decisão'),
(14, 7, 3, 29, 'Peso Pena', 1, 29, 2, 'Finalização'),
(15, 7, 22, 27, 'Peso Leve', 1, 22, 1, 'KO'),
(16, 8, 28, 23, 'Peso Leve', 1, 28, 2, 'KO'),
(17, 8, 29, 24, 'Peso Médio', 1, 29, 1, 'Finalização'),
(18, 8, 30, 25, 'Peso Meio-Médio', 0, NULL, NULL, NULL),
(19, 8, 31, 26, 'Peso Meio-Pesado', 0, NULL, NULL, NULL),
(20, 9, 32, 27, 'Peso Pesado', 0, NULL, NULL, NULL),
(21, 9, 33, 28, 'Peso Galo', 0, NULL, NULL, NULL),
(22, 9, 34, 29, 'Peso Leve', 0, NULL, NULL, NULL),
(23, 9, 35, 30, 'Peso Pena', 0, NULL, NULL, NULL),
(24, 10, 36, 31, 'Peso Pena', 1, 36, 1, 'KO'),
(25, 10, 37, 32, 'Peso Palha', 1, 32, 2, 'Decisão'),
(26, 10, 38, 33, 'Peso Médio', 1, 38, 1, 'Finalização'),
(27, 10, 1, 34, 'Peso Leve', 1, 1, 3, 'Decisão'),
(28, 10, 2, 35, 'Peso Galo', 1, 35, 2, 'KO'),
(29, 11, 3, 27, 'Peso Médio', 0, NULL, NULL, NULL),
(30, 11, 22, 31, 'Peso Pena', 0, NULL, NULL, NULL),
(31, 11, 23, 32, 'Peso Leve', 0, NULL, NULL, NULL),
(32, 11, 24, 30, 'Peso Meio-Médio', 0, NULL, NULL, NULL),
(33, 12, 28, 31, 'Peso Galo', 0, NULL, NULL, NULL),
(34, 12, 29, 33, 'Peso Meio-Pesado', 0, NULL, NULL, NULL),
(35, 12, 36, 34, 'Peso Pesado', 0, NULL, NULL, NULL),
(36, 2, 28, 29, 'Peso Galo', 0, NULL, NULL, NULL),
(37, 2, 30, 31, 'Peso Leve', 0, NULL, NULL, NULL),
(38, 2, 32, 33, 'Peso Médio', 0, NULL, NULL, NULL),
(39, 2, 34, 35, 'Peso Pesado', 0, NULL, NULL, NULL),
(40, 2, 36, 37, 'Peso Pena', 0, NULL, NULL, NULL),
(41, 3, 1, 22, 'Peso Leve', 1, 1, 2, 'KO'),
(42, 3, 2, 23, 'Peso Meio-Médio', 1, 23, 1, 'Finalização'),
(43, 3, 3, 24, 'Peso Médio', 1, 3, 3, 'Decisão'),
(44, 3, 28, 29, 'Peso Galo', 1, 28, 2, 'KO'),
(45, 3, 27, 31, 'Peso Leve', 1, 31, 1, 'Finalização');

-- --------------------------------------------------------

--
-- Estrutura para tabela `predictions`
--

CREATE TABLE `predictions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `fight_id` int NOT NULL,
  `predicted_winner_fighter_id` int DEFAULT NULL,
  `predicted_round` int DEFAULT NULL,
  `predicted_method` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `points` int DEFAULT '0',
  `is_correct` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `predictions`
--

INSERT INTO `predictions` (`id`, `user_id`, `fight_id`, `predicted_winner_fighter_id`, `predicted_round`, `predicted_method`, `points`, `is_correct`, `created_at`) VALUES
(1, 1, 1, 3, 2, 'Decisão', 8, 1, '2026-08-22 16:19:07'),
(7, 1, 2, 2, 2, 'Finalização', 0, 0, '2026-08-22 16:20:42'),
(14, 1, 13, 2, 3, 'Decisão', 15, 1, '2026-09-05 17:55:36'),
(15, 1, 18, 30, 1, 'KO', 0, 0, '2026-09-05 17:55:36'),
(16, 8, 11, 37, 2, 'Decisão', 15, 1, '2026-09-05 18:00:04'),
(17, 9, 12, 1, 1, 'KO', 0, 0, '2026-09-05 18:00:04'),
(18, 5, 13, 2, 3, 'Decisão', 15, 1, '2026-09-05 18:00:04'),
(19, 2, 24, 36, 1, 'KO', 15, 1, '2026-09-05 18:00:04'),
(20, 3, 25, 37, 2, 'Decisão', 0, 0, '2026-09-05 18:00:04'),
(21, 4, 26, 33, 2, 'Finalização', 12, 1, '2026-09-05 18:00:04'),
(22, 5, 16, 28, 2, 'KO', 15, 1, '2026-09-05 18:00:04'),
(23, 6, 17, 24, 1, 'Finalização', 0, 0, '2026-09-05 18:00:04'),
(24, 7, 2, 3, 2, 'Finalização', 0, 0, '2026-09-05 18:00:04'),
(25, 2, 41, 1, 2, 'KO', 15, 1, '2026-09-05 18:30:22'),
(26, 3, 41, 22, 1, 'Decisão', 0, 0, '2026-09-05 18:30:22'),
(27, 4, 42, 23, 1, 'Finalização', 15, 1, '2026-09-05 18:30:22'),
(28, 5, 43, 3, 2, 'Decisão', 12, 1, '2026-09-05 18:30:22'),
(29, 6, 44, 29, 2, 'KO', 0, 0, '2026-09-05 18:30:22'),
(30, 7, 45, 31, 1, 'Finalização', 15, 1, '2026-09-05 18:30:22'),
(31, 8, 36, 28, 1, 'KO', 0, 0, '2026-09-05 18:30:22'),
(32, 9, 37, 31, 3, 'Decisão', 0, 0, '2026-09-05 18:30:22');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('fan','athlete','admin') COLLATE utf8mb4_general_ci DEFAULT 'fan',
  `verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `phone`, `name`, `role`, `verified`, `created_at`) VALUES
(1, '31984107540', 'Ezequias Martins', 'admin', 0, '2026-08-22 14:23:52'),
(2, '31910001001', 'Marina Costa', 'fan', 1, '2026-09-05 17:55:36'),
(3, '31920002002', 'Julia Fernandes', 'fan', 1, '2026-09-05 17:55:36'),
(4, '31930003003', 'Pedro Henrique', 'fan', 1, '2026-09-05 17:55:36'),
(5, '31940004004', 'Camila Souza', 'fan', 1, '2026-09-05 17:55:36'),
(6, '31950005005', 'Bruno Lima', 'fan', 1, '2026-09-05 17:55:36'),
(7, '31960006006', 'Ana Paula', 'fan', 1, '2026-09-05 17:55:36'),
(8, '31970007007', 'Rafael Torres', 'fan', 1, '2026-09-05 17:55:36'),
(9, '31980008008', 'Larissa Melo', 'fan', 1, '2026-09-05 17:55:36');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `fighters`
--
ALTER TABLE `fighters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_fighter_name` (`name`);

--
-- Índices de tabela `fights`
--
ALTER TABLE `fights`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `fights_fighter1_fk` (`fighter1_id`),
  ADD KEY `fights_fighter2_fk` (`fighter2_id`),
  ADD KEY `fights_winner_fighter_fk` (`winner_fighter_id`);

--
-- Índices de tabela `predictions`
--
ALTER TABLE `predictions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`fight_id`),
  ADD UNIQUE KEY `unique_user_fight` (`user_id`,`fight_id`),
  ADD KEY `fight_id` (`fight_id`),
  ADD KEY `predictions_winner_fighter_fk` (`predicted_winner_fighter_id`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `fighters`
--
ALTER TABLE `fighters`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT de tabela `fights`
--
ALTER TABLE `fights`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de tabela `predictions`
--
ALTER TABLE `predictions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `fights`
--
ALTER TABLE `fights`
  ADD CONSTRAINT `fights_fighter1_fk` FOREIGN KEY (`fighter1_id`) REFERENCES `fighters` (`id`),
  ADD CONSTRAINT `fights_fighter2_fk` FOREIGN KEY (`fighter2_id`) REFERENCES `fighters` (`id`),
  ADD CONSTRAINT `fights_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  ADD CONSTRAINT `fights_winner_fighter_fk` FOREIGN KEY (`winner_fighter_id`) REFERENCES `fighters` (`id`);

--
-- Restrições para tabelas `predictions`
--
ALTER TABLE `predictions`
  ADD CONSTRAINT `predictions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `predictions_ibfk_2` FOREIGN KEY (`fight_id`) REFERENCES `fights` (`id`),
  ADD CONSTRAINT `predictions_winner_fighter_fk` FOREIGN KEY (`predicted_winner_fighter_id`) REFERENCES `fighters` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
