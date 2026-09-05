-- Seed 001: dados fictícios para popular a visualização do app
-- 20 fighters, 10 eventos, ~44 lutas e um conjunto de palpites (alguns já
-- respondidos, outros deixados em aberto de propósito para novos palpites).
-- Idempotente: pode ser executado mais de uma vez sem duplicar registros.

START TRANSACTION;

-- 0) Normaliza espaços à direita em nomes de eventos (o dump original trazia
-- "UFC 319 - Edição 98        " com espaços, o que quebra os matches por nome)
UPDATE events SET name = TRIM(TRAILING ' ' FROM name);

-- 1) Fighters (17 novos + os 3 já existentes = 20)
INSERT IGNORE INTO fighters (name, nickname, weight_class, wins, losses, draws) VALUES
('Bruno Alves', 'Falcão', 'Peso Pena', 12, 2, 0),
('Diego Ramos', 'Trovão', 'Peso Leve', 15, 3, 1),
('Rafael Souza', 'Guerreiro', 'Peso Meio-Médio', 10, 4, 0),
('Lucas Andrade', 'Fúria', 'Peso Médio', 18, 1, 0),
('Marcos Lima', 'Predador', 'Peso Meio-Pesado', 9, 5, 0),
('Thiago Cardoso', 'Relâmpago', 'Peso Pesado', 14, 2, 0),
('André Pereira', 'Cobra', 'Peso Galo', 11, 3, 1),
('Vinícius Teixeira', 'Aço', 'Peso Pena', 8, 6, 0),
('Gabriel Nunes', 'Furacão', 'Peso Leve', 13, 2, 0),
('Pedro Martins', 'Martelo', 'Peso Meio-Médio', 16, 4, 0),
('Rodrigo Farias', 'Onça', 'Peso Médio', 7, 3, 0),
('Felipe Duarte', 'Titã', 'Peso Meio-Pesado', 10, 2, 1),
('Gustavo Ribeiro', 'Lâmina', 'Peso Pesado', 6, 1, 0),
('Henrique Correia', 'Vulcão', 'Peso Galo', 12, 5, 0),
('Leandro Batista', 'Tempestade', 'Peso Pena', 9, 1, 0),
('Mateus Cavalcante', 'Búfalo', 'Peso Leve', 17, 3, 0),
('Renato Moreira', 'Espectro', 'Peso Palha', 5, 0, 0);

-- 2) Eventos (7 novos + os 3 já existentes = 10)
INSERT INTO events (name, event_date, status)
SELECT * FROM (SELECT 'The God Fighter - Edição 02' AS name, '2026-09-20 20:00:00' AS event_date, 'open' AS status) t
WHERE NOT EXISTS (SELECT 1 FROM events WHERE name = t.name);

INSERT INTO events (name, event_date, status)
SELECT * FROM (SELECT 'Fury Combat Series 12' AS name, '2026-08-30 19:00:00' AS event_date, 'closed' AS status) t
WHERE NOT EXISTS (SELECT 1 FROM events WHERE name = t.name);

INSERT INTO events (name, event_date, status)
SELECT * FROM (SELECT 'Arena Warriors Cup' AS name, '2026-09-05 21:00:00' AS event_date, 'live' AS status) t
WHERE NOT EXISTS (SELECT 1 FROM events WHERE name = t.name);

INSERT INTO events (name, event_date, status)
SELECT * FROM (SELECT 'Elite Fight Night 45' AS name, '2026-09-25 20:00:00' AS event_date, 'open' AS status) t
WHERE NOT EXISTS (SELECT 1 FROM events WHERE name = t.name);

INSERT INTO events (name, event_date, status)
SELECT * FROM (SELECT 'Steel Cage Championship' AS name, '2026-07-05 19:00:00' AS event_date, 'closed' AS status) t
WHERE NOT EXISTS (SELECT 1 FROM events WHERE name = t.name);

INSERT INTO events (name, event_date, status)
SELECT * FROM (SELECT 'Thunder MMA Grand Prix' AS name, '2026-10-05 20:00:00' AS event_date, 'open' AS status) t
WHERE NOT EXISTS (SELECT 1 FROM events WHERE name = t.name);

INSERT INTO events (name, event_date, status)
SELECT * FROM (SELECT 'National Combat League 07' AS name, '2026-10-20 20:00:00' AS event_date, 'open' AS status) t
WHERE NOT EXISTS (SELECT 1 FROM events WHERE name = t.name);

-- 3) Fan users para os palpites fictícios
INSERT IGNORE INTO users (phone, name, role, verified) VALUES
('31910001001', 'Marina Costa', 'fan', 1),
('31920002002', 'Julia Fernandes', 'fan', 1),
('31930003003', 'Pedro Henrique', 'fan', 1),
('31940004004', 'Camila Souza', 'fan', 1),
('31950005005', 'Bruno Lima', 'fan', 1),
('31960006006', 'Ana Paula', 'fan', 1),
('31970007007', 'Rafael Torres', 'fan', 1),
('31980008008', 'Larissa Melo', 'fan', 1);

-- 4) Lutas
-- Helper: cada INSERT usa NOT EXISTS para não duplicar em reexecuções.

-- Evento 1 (The God Fighter - Edição 01) - 3 lutas novas, sem resultado
INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Pena' FROM events e, fighters f1, fighters f2
WHERE e.name='The God Fighter - Edição 01' AND f1.name='Bruno Alves' AND f2.name='Diego Ramos'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Meio-Médio' FROM events e, fighters f1, fighters f2
WHERE e.name='The God Fighter - Edição 01' AND f1.name='Rafael Souza' AND f2.name='Lucas Andrade'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Pesado' FROM events e, fighters f1, fighters f2
WHERE e.name='The God Fighter - Edição 01' AND f1.name='Marcos Lima' AND f2.name='Thiago Cardoso'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

-- Evento 2 (UFC 319 - Edição 98) - 5 lutas, sem resultado
INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Galo' FROM events e, fighters f1, fighters f2
WHERE e.name='UFC 319 - Edição 98' AND f1.name='André Pereira' AND f2.name='Vinícius Teixeira'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Leve' FROM events e, fighters f1, fighters f2
WHERE e.name='UFC 319 - Edição 98' AND f1.name='Gabriel Nunes' AND f2.name='Pedro Martins'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Médio' FROM events e, fighters f1, fighters f2
WHERE e.name='UFC 319 - Edição 98' AND f1.name='Rodrigo Farias' AND f2.name='Felipe Duarte'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Pesado' FROM events e, fighters f1, fighters f2
WHERE e.name='UFC 319 - Edição 98' AND f1.name='Gustavo Ribeiro' AND f2.name='Henrique Correia'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Pena' FROM events e, fighters f1, fighters f2
WHERE e.name='UFC 319 - Edição 98' AND f1.name='Leandro Batista' AND f2.name='Mateus Cavalcante'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

-- Evento 3 (UFC 320 - Edição 99, encerrado) - 5 lutas com resultado
INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Leve', 1, f1.id, 2, 'KO' FROM events e, fighters f1, fighters f2
WHERE e.name='UFC 320 - Edição 99' AND f1.name='Topuria' AND f2.name='Bruno Alves'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Meio-Médio', 1, f2.id, 1, 'Finalização' FROM events e, fighters f1, fighters f2
WHERE e.name='UFC 320 - Edição 99' AND f1.name='Terremoto' AND f2.name='Diego Ramos'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Médio', 1, f1.id, 3, 'Decisão' FROM events e, fighters f1, fighters f2
WHERE e.name='UFC 320 - Edição 99' AND f1.name='Oliveira' AND f2.name='Rafael Souza'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Galo', 1, f1.id, 2, 'KO' FROM events e, fighters f1, fighters f2
WHERE e.name='UFC 320 - Edição 99' AND f1.name='André Pereira' AND f2.name='Vinícius Teixeira'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Leve', 1, f2.id, 1, 'Finalização' FROM events e, fighters f1, fighters f2
WHERE e.name='UFC 320 - Edição 99' AND f1.name='Thiago Cardoso' AND f2.name='Pedro Martins'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

-- Evento 4 (The God Fighter - Edição 02, futuro) - 4 lutas, sem resultado
INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Meio-Médio' FROM events e, fighters f1, fighters f2
WHERE e.name='The God Fighter - Edição 02' AND f1.name='Vinícius Teixeira' AND f2.name='Gabriel Nunes'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Médio' FROM events e, fighters f1, fighters f2
WHERE e.name='The God Fighter - Edição 02' AND f1.name='Pedro Martins' AND f2.name='Rodrigo Farias'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Meio-Pesado' FROM events e, fighters f1, fighters f2
WHERE e.name='The God Fighter - Edição 02' AND f1.name='Felipe Duarte' AND f2.name='Gustavo Ribeiro'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Pesado' FROM events e, fighters f1, fighters f2
WHERE e.name='The God Fighter - Edição 02' AND f1.name='Henrique Correia' AND f2.name='Leandro Batista'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

-- Evento 5 (Fury Combat Series 12, encerrado) - 5 lutas com resultado
INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Palha', 1, f1.id, 2, 'Decisão' FROM events e, fighters f1, fighters f2
WHERE e.name='Fury Combat Series 12' AND f1.name='Mateus Cavalcante' AND f2.name='Renato Moreira'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Meio-Médio', 1, f2.id, 1, 'KO' FROM events e, fighters f1, fighters f2
WHERE e.name='Fury Combat Series 12' AND f1.name='Topuria' AND f2.name='Rafael Souza'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Galo', 1, f1.id, 3, 'Decisão' FROM events e, fighters f1, fighters f2
WHERE e.name='Fury Combat Series 12' AND f1.name='Terremoto' AND f2.name='André Pereira'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Pena', 1, f2.id, 2, 'Finalização' FROM events e, fighters f1, fighters f2
WHERE e.name='Fury Combat Series 12' AND f1.name='Oliveira' AND f2.name='Vinícius Teixeira'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Leve', 1, f1.id, 1, 'KO' FROM events e, fighters f1, fighters f2
WHERE e.name='Fury Combat Series 12' AND f1.name='Bruno Alves' AND f2.name='Thiago Cardoso'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

-- Evento 6 (Arena Warriors Cup, ao vivo) - 2 lutas com resultado + 2 pendentes
INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Leve', 1, f1.id, 2, 'KO' FROM events e, fighters f1, fighters f2
WHERE e.name='Arena Warriors Cup' AND f1.name='André Pereira' AND f2.name='Diego Ramos'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Médio', 1, f1.id, 1, 'Finalização' FROM events e, fighters f1, fighters f2
WHERE e.name='Arena Warriors Cup' AND f1.name='Vinícius Teixeira' AND f2.name='Rafael Souza'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Meio-Médio' FROM events e, fighters f1, fighters f2
WHERE e.name='Arena Warriors Cup' AND f1.name='Gabriel Nunes' AND f2.name='Lucas Andrade'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Meio-Pesado' FROM events e, fighters f1, fighters f2
WHERE e.name='Arena Warriors Cup' AND f1.name='Pedro Martins' AND f2.name='Marcos Lima'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

-- Evento 7 (Elite Fight Night 45, futuro) - 4 lutas, sem resultado
INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Pesado' FROM events e, fighters f1, fighters f2
WHERE e.name='Elite Fight Night 45' AND f1.name='Rodrigo Farias' AND f2.name='Thiago Cardoso'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Galo' FROM events e, fighters f1, fighters f2
WHERE e.name='Elite Fight Night 45' AND f1.name='Felipe Duarte' AND f2.name='André Pereira'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Leve' FROM events e, fighters f1, fighters f2
WHERE e.name='Elite Fight Night 45' AND f1.name='Gustavo Ribeiro' AND f2.name='Vinícius Teixeira'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Pena' FROM events e, fighters f1, fighters f2
WHERE e.name='Elite Fight Night 45' AND f1.name='Henrique Correia' AND f2.name='Gabriel Nunes'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

-- Evento 8 (Steel Cage Championship, encerrado) - 5 lutas com resultado
INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Pena', 1, f1.id, 1, 'KO' FROM events e, fighters f1, fighters f2
WHERE e.name='Steel Cage Championship' AND f1.name='Leandro Batista' AND f2.name='Pedro Martins'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Palha', 1, f2.id, 2, 'Decisão' FROM events e, fighters f1, fighters f2
WHERE e.name='Steel Cage Championship' AND f1.name='Mateus Cavalcante' AND f2.name='Rodrigo Farias'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Médio', 1, f1.id, 1, 'Finalização' FROM events e, fighters f1, fighters f2
WHERE e.name='Steel Cage Championship' AND f1.name='Renato Moreira' AND f2.name='Felipe Duarte'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Leve', 1, f1.id, 3, 'Decisão' FROM events e, fighters f1, fighters f2
WHERE e.name='Steel Cage Championship' AND f1.name='Topuria' AND f2.name='Gustavo Ribeiro'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class, locked, winner_fighter_id, winner_round, winner_method)
SELECT e.id, f1.id, f2.id, 'Peso Galo', 1, f2.id, 2, 'KO' FROM events e, fighters f1, fighters f2
WHERE e.name='Steel Cage Championship' AND f1.name='Terremoto' AND f2.name='Henrique Correia'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

-- Evento 9 (Thunder MMA Grand Prix, futuro) - 4 lutas, sem resultado
INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Médio' FROM events e, fighters f1, fighters f2
WHERE e.name='Thunder MMA Grand Prix' AND f1.name='Oliveira' AND f2.name='Thiago Cardoso'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Pena' FROM events e, fighters f1, fighters f2
WHERE e.name='Thunder MMA Grand Prix' AND f1.name='Bruno Alves' AND f2.name='Pedro Martins'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Leve' FROM events e, fighters f1, fighters f2
WHERE e.name='Thunder MMA Grand Prix' AND f1.name='Diego Ramos' AND f2.name='Rodrigo Farias'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Meio-Médio' FROM events e, fighters f1, fighters f2
WHERE e.name='Thunder MMA Grand Prix' AND f1.name='Rafael Souza' AND f2.name='Gabriel Nunes'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

-- Evento 10 (National Combat League 07, futuro) - 3 lutas, sem resultado
INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Galo' FROM events e, fighters f1, fighters f2
WHERE e.name='National Combat League 07' AND f1.name='André Pereira' AND f2.name='Pedro Martins'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Meio-Pesado' FROM events e, fighters f1, fighters f2
WHERE e.name='National Combat League 07' AND f1.name='Vinícius Teixeira' AND f2.name='Felipe Duarte'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

INSERT INTO fights (event_id, fighter1_id, fighter2_id, weight_class)
SELECT e.id, f1.id, f2.id, 'Peso Pesado' FROM events e, fighters f1, fighters f2
WHERE e.name='National Combat League 07' AND f1.name='Leandro Batista' AND f2.name='Gustavo Ribeiro'
AND NOT EXISTS (SELECT 1 FROM fights WHERE event_id=e.id AND fighter1_id=f1.id AND fighter2_id=f2.id);

-- 5) Palpites (mistura de lutas já encerradas com pontos calculados e lutas
-- ainda abertas, deixando várias lutas sem nenhum palpite para novos testes)

-- UFC 320 (encerrado)
INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter1_id, 2, 'KO', 15, 1
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='UFC 320 - Edição 99' AND a.name='Topuria' AND b.name='Bruno Alves') fi
WHERE u.phone='31910001001'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter2_id, 1, 'Decisão', 0, 0
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='UFC 320 - Edição 99' AND a.name='Topuria' AND b.name='Bruno Alves') fi
WHERE u.phone='31920002002'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter2_id, 1, 'Finalização', 15, 1
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='UFC 320 - Edição 99' AND a.name='Terremoto' AND b.name='Diego Ramos') fi
WHERE u.phone='31930003003'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter1_id, 2, 'Decisão', 12, 1
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='UFC 320 - Edição 99' AND a.name='Oliveira' AND b.name='Rafael Souza') fi
WHERE u.phone='31940004004'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter2_id, 2, 'KO', 0, 0
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='UFC 320 - Edição 99' AND a.name='André Pereira' AND b.name='Vinícius Teixeira') fi
WHERE u.phone='31950005005'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter2_id, 1, 'Finalização', 15, 1
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='UFC 320 - Edição 99' AND a.name='Thiago Cardoso' AND b.name='Pedro Martins') fi
WHERE u.phone='31960006006'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

-- Fury Combat Series 12 (encerrado)
INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter1_id, 2, 'Decisão', 15, 1
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='Fury Combat Series 12' AND a.name='Mateus Cavalcante' AND b.name='Renato Moreira') fi
WHERE u.phone='31970007007'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter1_id, 1, 'KO', 0, 0
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='Fury Combat Series 12' AND a.name='Topuria' AND b.name='Rafael Souza') fi
WHERE u.phone='31980008008'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter1_id, 3, 'Decisão', 15, 1
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='Fury Combat Series 12' AND a.name='Terremoto' AND b.name='André Pereira') fi
WHERE u.phone='31940004004'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

-- Steel Cage Championship (encerrado)
INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter1_id, 1, 'KO', 15, 1
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='Steel Cage Championship' AND a.name='Leandro Batista' AND b.name='Pedro Martins') fi
WHERE u.phone='31910001001'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter1_id, 2, 'Decisão', 0, 0
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='Steel Cage Championship' AND a.name='Mateus Cavalcante' AND b.name='Rodrigo Farias') fi
WHERE u.phone='31920002002'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter2_id, 2, 'Finalização', 12, 1
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='Steel Cage Championship' AND a.name='Renato Moreira' AND b.name='Felipe Duarte') fi
WHERE u.phone='31930003003'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

-- Arena Warriors Cup (ao vivo, lutas já com resultado)
INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter1_id, 2, 'KO', 15, 1
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='Arena Warriors Cup' AND a.name='André Pereira' AND b.name='Diego Ramos') fi
WHERE u.phone='31940004004'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter2_id, 1, 'Finalização', 0, 0
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='Arena Warriors Cup' AND a.name='Vinícius Teixeira' AND b.name='Rafael Souza') fi
WHERE u.phone='31950005005'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

-- Palpites pendentes (lutas ainda abertas, aguardando resultado)
INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter2_id, 2, 'Finalização', 0, 0
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='The God Fighter - Edição 01' AND a.name='Terremoto' AND b.name='Oliveira') fi
WHERE u.phone='31960006006'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter1_id, 1, 'KO', 0, 0
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='UFC 319 - Edição 98' AND a.name='André Pereira' AND b.name='Vinícius Teixeira') fi
WHERE u.phone='31970007007'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter2_id, 3, 'Decisão', 0, 0
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='UFC 319 - Edição 98' AND a.name='Gabriel Nunes' AND b.name='Pedro Martins') fi
WHERE u.phone='31980008008'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

INSERT INTO predictions (user_id, fight_id, predicted_winner_fighter_id, predicted_round, predicted_method, points, is_correct)
SELECT u.id, fi.id, fi.fighter1_id, 1, 'KO', 0, 0
FROM users u, (SELECT f.id, f.fighter1_id, f.fighter2_id FROM fights f JOIN events e ON e.id=f.event_id JOIN fighters a ON a.id=f.fighter1_id JOIN fighters b ON b.id=f.fighter2_id WHERE e.name='Arena Warriors Cup' AND a.name='Gabriel Nunes' AND b.name='Lucas Andrade') fi
WHERE u.phone='31984107540'
AND NOT EXISTS (SELECT 1 FROM predictions p WHERE p.user_id=u.id AND p.fight_id=fi.id);

-- 6) Recalcula fights_count de todos os eventos
UPDATE events e SET fights_count = (SELECT COUNT(*) FROM fights f WHERE f.event_id = e.id);

COMMIT;
