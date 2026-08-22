# The Godfighter - Roadmap Fase 2 e 3
## Ecossistema Definitivo - Documento Técnico

Data: 22/08/2026
Status Fase 1: CONCLUÍDA (Quiz + Ranking Fãs + Trava)

---

### FASE 2 - FECHAMENTO DO QUIZ + PATROCINADORES (2 semanas)

#### Objetivo: Finalizar a experiência do palpiteiro e começar a monetização por exposição.

**1. Tela de Resumo + Viralização**
- Rota: `GET /api/predictions/my-summary/:event_id`
- Retorna todas as lutas do evento com seus palpites.
- Frontend: `EventSummary.jsx` com botão "Gerar Imagem para Stories"
- A imagem gerada (canvas) deve conter:
    - Logo The Godfighter
    - Seus palpites
    - Logo do patrocinador master do evento
    - CTA: "Siga @thegodfighter e @patrocinador"

**2. Módulo de Patrocinadores**
```sql
CREATE TABLE sponsors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  active TINYINT DEFAULT 1
);

CREATE TABLE event_sponsors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  sponsor_id INT NOT NULL,
  placement ENUM('card_top','bet_screen','summary') NOT NULL,
  impressions INT DEFAULT 0,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (sponsor_id) REFERENCES sponsors(id)
);

-- Tabela para métrica de impressão real
CREATE TABLE sponsor_impressions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_sponsor_id INT NOT NULL,
  user_id INT NOT NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration_seconds INT DEFAULT 0
);

3. Ajuste em Events para Matriz de Pesos

ALTER TABLE events ADD COLUMN weight INT DEFAULT 1 COMMENT '1=Municipal até 10=Olimpiada/Cinturão Pro';
ALTER TABLE events ADD COLUMN sponsor_id INT NULL;
ALTER TABLE events ADD COLUMN city VARCHAR(100) DEFAULT NULL;
ALTER TABLE events ADD COLUMN category VARCHAR(50) DEFAULT 'MMA';

Entregáveis Fase 2:
1. EventSummary.jsx com geração de imagem
2. api.get('/events/:id/sponsors') incrementando impressions
3. Admin consegue vincular patrocinador ao evento

FASE 3 - MATCHING ENGINE + MONETIZAÇÃO 
(O Coração Financeiro)

Objetivo: Implementar a Votação Anual Lastreada em Rifas. É o que financia a premiação.

Conceito Chave do PDF: O celular é a Primary Key entre PWA e plataforma de rifas (apprf.com).

1. Tabelas de Rifas e Votos:

-- Importação das rifas (via CSV ou API da apprf.com)
CREATE TABLE raffle_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  buyer_name VARCHAR(100) NOT NULL,
  buyer_phone VARCHAR(20) NOT NULL COMMENT 'Chave primária de cruzamento - DDD + Numero',
  raffle_number VARCHAR(20) NOT NULL,
  status ENUM('pending','approved','cancelled') DEFAULT 'pending',
  campaign VARCHAR(100) DEFAULT 'FKS Fight Night',
  purchased_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_phone (buyer_phone),
  INDEX idx_status (status)
);

-- Votação Anual
CREATE TABLE annual_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT 'Ex: Atleta do Ano, Luta do Ano, Evento do Ano',
  year INT NOT NULL,
  active TINYINT DEFAULT 1
);

CREATE TABLE annual_votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  user_phone VARCHAR(20) NOT NULL COMMENT 'Denormalizado para matching rápido',
  category_id INT NOT NULL,
  voted_for_id INT NOT NULL COMMENT 'ID do atleta/evento votado',
  vote_type ENUM('free','raffle_bonus') NOT NULL,
  raffle_ticket_id INT NULL COMMENT 'Se for bonus, qual cota lastreou',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES annual_categories(id),
  FOREIGN KEY (raffle_ticket_id) REFERENCES raffle_tickets(id),
  UNIQUE KEY unique_free_vote (user_id, category_id, vote_type) COMMENT 'Garante só 1 voto free por categoria'
);

2. O Matching Engine (Lógica Backend):
Rota: POST /api/votes

// Pseudocódigo do Motor de Cruzamento
async function canVoteExtra(user_phone) {
  // 1. Verifica se já deu voto grátis
  const freeVote = await db.query('SELECT * FROM annual_votes WHERE user_phone=? AND category_id=? AND vote_type="free"', [phone, categoryId]);

  if (!freeVote.length) {
    // Libera 1 voto grátis
    return { allowed: true, type: 'free' };
  }

  // 2. Se já votou grátis, cruza com rifas
  const [tickets] = await db.query(`
    SELECT rt.* FROM raffle_tickets rt
    LEFT JOIN annual_votes av ON av.raffle_ticket_id = rt.id
    WHERE rt.buyer_phone =? AND rt.status='approved' AND av.id IS NULL
    LIMIT 1
  `, [user_phone]);

  if (tickets.length > 0) {
    // Tem cota válida não usada para voto
    return { allowed: true, type: 'raffle_bonus', ticket: tickets[0] };
  }

  // 3. Sem cota -> redireciona para comprar rifa
  return { allowed: false, redirect_url: 'https://apprf.com/fksfightnight' };
}

3. Admin - Importação de RifasRota: 

- POST /api/admin/raffles/import-csv (upload do CSV exportado da apprf.com)
- Colunas do CSV: Nome, Telefone, Numero da Cota, Status, Data
- O sistema normaliza o telefone (remove máscara) e insere em raffle_tickets.

4. Próximas Monetizações (Fase 3.1):

CREATE TABLE shop_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  price DECIMAL(10,2),
  type ENUM('physical','print_on_demand','ticket') NOT NULL,
  external_api_url VARCHAR(255) NULL COMMENT 'Link para Printful/Printify',
  stock INT DEFAULT 0
);

Entregáveis Fase 3:
- Matching Engine funcionando 100%
- Tela de Votação Anual com contador "Você tem X votos extras por rifas"
- Importador CSV de rifas no painel admin
- Dashboard: Total arrecadado em rifas vs Premiação anual

CHECKLIST FINAL DO ECOSSISTEMA
- Fase 1: Quiz + Ranking Fãs
- Fase 2: Resumo + Patrocinadores + Pesos
- Fase 3: Rifas + Votação Lastreada
- Fase 4: Hub de Atletas + Media Kit + Ranking Oficial por Peso (1-10)[x]

Próximo passo: Começar Fase 2 criando sponsors.