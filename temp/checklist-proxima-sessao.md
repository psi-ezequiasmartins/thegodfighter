# The Godfighter - Checklist de Retomada

Data de registro: 22/08/2026
Atualizado em: 05/09/2026 - ver seção "Atualização 05/09/2026" no final do arquivo.

## Contexto consolidado

O The Godfighter e um PWA para esportes de combate que une:

- Quiz de palpites e ranking para fas.
- Patrocinadores, premios, ingressos, loja e rifas.
- Votacao anual com votos extras vinculados a cotas de rifas.
- Hub de atletas, resultados auditados, ranking por modalidade e media kit.

O telefone deve ser uma chave de negocio unica e normalizada para integrar PWA e rifas. A chave tecnica continua sendo `users.id`; `users.phone` deve permanecer com indice unico e, antes de producao, ser verificado por WhatsApp ou SMS.

## Situacao atual confirmada

- Frontend: React 19 com Create React App, React Router, Axios e Tailwind.
- Backend: Express 5, MySQL (`mysql2`), JWT e CORS.
- Fase 1 parcialmente implementada: cadastro/login por telefone, eventos, lutas, palpites, bloqueio de luta, lancamento de resultado e ranking.
- Ainda nao existe PWA completo: falta registrar service worker e finalizar configuracao de instalacao/offline.
- Algumas telas usam dados ficticios se a API falha. Antes da publicacao, isso deve virar estados claros de carregamento, vazio e erro.

## Prioridade 0 - Corrigir a integridade da Fase 1

Status: RESOLVIDO em 05/09/2026 (ver seção "Atualização 05/09/2026").

Hipotese a validar: a apuracao de resultados falha no banco criado a partir de `temp/schema.sql`, porque o schema e as rotas usam nomes de colunas diferentes.

Evidencias:

- `temp/schema.sql` define em `fights`: `result_winner_name`, `result_round`, `result_method`.
- `backend/src/routes/admin.js` grava e consulta: `winner_name`, `winner_round`, `winner_method`.
- `backend/src/routes/ranking.js` usa `predictions.is_correct`, mas essa coluna nao existe no schema atual.
- `backend/src/routes/events.js` permite criar eventos e lutas para qualquer usuario autenticado; a regra de administrador precisa ser aplicada.

### Checklist tecnico

- [x] Conferir o schema real do banco de desenvolvimento antes de qualquer alteracao.
- [x] Definir a convencao definitiva para resultado de luta: preferir `winner_name`, `winner_round` e `winner_method` para compatibilizar com a rota de administracao, ou ajustar todas as consultas para `result_*`.
- [x] Criar uma migracao SQL incremental; nao alterar silenciosamente bancos existentes.
- [x] Adicionar `predictions.is_correct TINYINT(1)` com valor padrao adequado. (já existia no dump atual)
- [x] Garantir que `predictions.points` e `predictions.is_correct` sejam atualizados na mesma transacao que o resultado e o bloqueio da luta.
- [x] Validar vencedor, round e metodo antes de salvar resultado ou palpite.
- [x] Validar que o vencedor informado pertence a luta correspondente.
- [x] Restringir criacao de eventos e lutas a administradores.
- [x] Retornar `404` ao tentar lancar resultado para uma luta inexistente e evitar reprocessamento acidental de uma luta ja encerrada. (404 implementado; bloqueio de reprocessamento ainda não impede reenvio se admin quiser corrigir - avaliar se é desejado)
- [ ] Testar manualmente: criar evento/luta, inserir palpites, lancar resultado, confirmar pontos e conferir ranking. (testado via API; falta teste end-to-end pela UI)

## Prioridade 1 - Fechar a experiencia do Quiz

- [ ] Remover os mocks/fallbacks de producao em `Events`, `Fights`, `MeusPalpites` e `Ranking`.
- [ ] Criar componentes ou estados consistentes de carregamento, lista vazia e erro de API.
- [ ] Fazer a rota de lutas retornar dados necessarios para a tela: categoria de peso, status e indicador de palpite do usuario autenticado.
- [ ] Impedir alteracao de palpite apos o horario de inicio do evento ou apos bloqueio administrativo; definir a regra de negocio explicitamente.
- [ ] Criar a tela de resumo por evento antes da confirmacao definitiva.
- [ ] Permitir revisar e editar cada luta no resumo enquanto o evento estiver aberto.
- [ ] Mostrar progresso robusto, inclusive para eventos sem lutas, evitando divisao por zero na barra de progresso.
- [ ] Criar rota de administracao com autenticacao e controle de papel para cadastrar evento, card, resultados e status.
- [ ] Proteger rotas do frontend quando nao houver token valido e tratar expiracao de sessao.
- [ ] Revisar nomes, status e dados retornados por API para que o frontend nao dependa de formatos divergentes.

## Prioridade 2 - PWA e qualidade de uso

- [ ] Confirmar e configurar manifesto, icones, metadados e tema do PWA.
- [ ] Registrar service worker e definir uma estrategia segura de cache para arquivos estaticos e API.
- [ ] Tornar a URL base da API configuravel por variavel de ambiente; nao manter `http://localhost:3001/api` fixo em producao.
- [ ] Padronizar a navegacao mobile; a interface atual possui sidebar desktop, mas menu mobile limitado.
- [ ] Revisar contraste, foco de teclado, areas de toque e mensagens de erro.
- [ ] Definir identidade visual com tipografia, cores, imagens reais de luta/eventos e componentes consistentes, sem perder desempenho em celular.
- [ ] Avaliar substituicao futura do Create React App, que esta descontinuado, por Vite ou outro bundler; nao fazer esta migracao junto da correcao de negocio.

## Prioridade 3 - Fase 2: patrocinadores e compartilhamento

- [ ] Criar migracao para `sponsors`, `event_sponsors` e `sponsor_impressions`.
- [ ] Incluir em `events`: modalidade/categoria, cidade, peso de relevancia e campos de patrocinio conforme o modelo definitivo.
- [ ] Definir formatos permitidos, armazenamento e moderacao para logos e banners.
- [ ] Criar endpoint de patrocinadores por evento com posicionamento: card, tela de palpite e resumo.
- [ ] Registrar impressoes com criterio mensuravel e idempotente, evitando inflar metricas em recargas repetidas.
- [ ] Criar `EventSummary.jsx` com todos os palpites e patrocinador master do evento.
- [ ] Gerar imagem de compartilhamento por Canvas ou biblioteca adequada, respeitando CORS de imagens e privacidade do usuario.
- [ ] Criar tela administrativa para cadastrar patrocinador e vincula-lo a um evento.

## Prioridade 4 - Fase 3: rifas e votacao anual

- [ ] Definir politica de privacidade, consentimento e retencao de dados antes de integrar compras e telefone.
- [ ] Criar normalizador unico de telefone para cadastro, login e importacao de rifas; adotar formato E.164.
- [ ] Criar migracoes para `raffle_tickets`, `annual_categories` e `annual_votes`.
- [ ] Modelar candidatos de votacao sem depender de `voted_for_id` polimorfico sem tipo; usar entidade de candidato ou armazenar tipo e chave com validacao.
- [ ] Garantir atomicidade ao consumir uma cota de rifa para voto extra, impedindo uso duplo em requisicoes simultaneas.
- [ ] Implementar endpoint que informa saldo de votos gratuito e de rifas por categoria.
- [ ] Implementar votacao com trilha de auditoria e regras claras de abertura/encerramento por categoria/ano.
- [ ] Definir integracao com apprf.com: CSV primeiro; API/webhook somente se houver contrato e documentacao disponivel.
- [ ] Adicionar upload CSV seguro no backend: autenticacao admin, limite de tamanho, validacao de colunas, preview, deduplicacao e relatorio de erros.
- [ ] Criar dashboard administrativo de rifas, votos, saldo de cotas e valor destinado a premiacao.

## Prioridade 5 - Fase 4: hub de atletas e ranking oficial

- [ ] Criar modelo relacional de atletas; deixar de depender apenas de nomes textuais em `fights`.
- [ ] Modelar modalidades, perfis de atleta por modalidade, participacoes, resultados e evidencias (links de video/documentos).
- [ ] Implementar estados de moderacao: pendente, aprovado, rejeitado, com responsavel, data e justificativa.
- [ ] Criar matriz de pesos de evento de 1 a 10 e documentar como cada resultado gera pontos.
- [ ] Separar ranking de fas do ranking oficial de atletas, por ano, modalidade e geral.
- [ ] Criar perfil publico e media kit anual com dados somente aprovados.
- [ ] Catalogar parceiros, eventos historicos, categorias e campeoes.

## Seguranca e operacao antes de producao

- [ ] Implementar verificacao real de telefone por WhatsApp ou SMS e limitar tentativas.
- [ ] Adicionar rate limiting para login, cadastro, votos e importacoes.
- [ ] Validar todas as entradas no backend com um esquema compartilhado ou biblioteca de validacao.
- [ ] Configurar CORS por ambiente e lista de origens permitidas.
- [ ] Nunca expor segredos em frontend, repositório ou logs; manter `.env` fora do Git.
- [ ] Implementar logs estruturados, health check, tratamento padrao de erros e backup do MySQL.
- [ ] Criar testes para regras criticas: bloqueio de palpite, pontuacao, permissao de admin e consumo unico de cota de rifa.

## Primeiro passo ao retomar

1. Ler este checklist e confirmar se o banco em uso foi criado a partir de `temp/schema.sql`.
2. Inspecionar o schema real com `DESCRIBE fights;` e `DESCRIBE predictions;`.
3. Criar a migracao de compatibilidade e ajustar as rotas de resultado/ranking de forma consistente.
4. Executar o teste completo de apuracao de uma luta antes de iniciar a tela de resumo ou patrocinadores.

## Atualização 05/09/2026

Banco renomeado para `thegodfighter` (singular). Dump atualizado em `temp/thegodfighter.sql`
já usava `winner_name/winner_round/winner_method` e `predictions.is_correct`, então o problema
de nomenclatura da Prioridade 0 estava resolvido antes mesmo desta sessão.

Nesta sessão, o nome do competidor foi padronizado como `Fighter` (inglês no schema/código,
"Lutador"/"Competidor" na UI em português). Principais mudanças:

- Nova migração `temp/migration_002_fighters.sql`: cria tabela `fighters` (perfil do lutador:
  nome, apelido, categoria de peso, vitórias/derrotas/empates, foto, bio) e substitui os campos
  de texto `athlete1_name`/`athlete2_name`/`winner_name` em `fights` e `predicted_winner_name`
  em `predictions` por FKs (`fighter1_id`, `fighter2_id`, `winner_fighter_id`,
  `predicted_winner_fighter_id`). Migração já aplicada no banco de desenvolvimento local.
- Backend: CRUD completo (listar/criar/editar/remover) para `fighters`, `events` e `fights`,
  com `middleware/isAdmin.js` reutilizável protegendo as rotas de escrita. Rota de resultado
  (`POST /api/admin/fights/:id/result`) agora valida que o vencedor pertence à luta e retorna
  404 se a luta não existir. Predictions agora usa `predicted_winner_fighter_id` e ganhou
  `DELETE /api/predictions/:fightId` para remover um palpite antes do bloqueio.
- Frontend: removidos os mocks de fallback em `Events.jsx`, `Fights.jsx` e `MeusPalpites.jsx`,
  substituídos por estados reais de carregamento/vazio/erro. `PredictionFlow.jsx` e
  `AdminResult.jsx` atualizados para trabalhar com `fighter_id` (o `AdminResult.jsx` também
  corrigiu um bug: postava para a rota errada `/fights/:id/result` com campos que não batiam
  com o backend). Novas telas administrativas: `AdminEvents.jsx`, `AdminFights.jsx`,
  `AdminFighters.jsx`, protegidas por `components/AdminRoute.jsx` (só usuários com
  `role === 'admin'`), com links correspondentes no `Navbar.jsx`.
- Testado manualmente via API (login, listar, criar, editar, remover fighters/events/fights;
  conflito 409 ao remover evento com luta associada). Falta testar o fluxo pela UI do navegador.

### Próximos passos sugeridos
- [ ] Testar o CRUD completo navegando pela UI (não só via API).
- [ ] Avaliar se `POST /admin/fights/:id/result` deve bloquear reenvio de resultado já lançado
      (hoje permite corrigir, o que pode ser desejado ou não).
- [ ] Seguir para Prioridade 1 (fechar experiência do quiz) e Prioridade 2 (PWA) do checklist.
