# Análise crítica do projeto SoU_Estudante

Data da análise: 2026-10-10. Escopo: raiz do repositório, `docs/`, `packages/api` (Go) e `packages/front` (Next.js).

## Como usar este documento

- Cada seção é independente e pode virar uma tarefa ou um PR.
- Cada item de checklist traz o caminho do arquivo, para dar para começar sem pesquisar de novo.
- Prioridades: **P0** quebra algo ou é risco real. **P1** inconsistência que confunde ou gera bug. **P2** melhoria de organização.
- Os itens marcados **(não verificado)** foram deduzidos pela leitura do código e precisam de confirmação antes de mexer.
- Nada neste documento foi alterado no código. É só diagnóstico.

## Índice

1. [Resumo executivo](#1-resumo-executivo)
2. [Verificações automáticas](#2-verificações-automáticas)
3. [Repositório, raiz e segredos](#3-repositório-raiz-e-segredos)
4. [CI/CD e tooling](#4-cicd-e-tooling)
5. [Documentação: links e estrutura de `docs/`](#5-documentação-links-e-estrutura-de-docs)
6. [Documentação: conteúdo desatualizado](#6-documentação-conteúdo-desatualizado)
7. [Documentação: contradições e duplicações](#7-documentação-contradições-e-duplicações)
8. [Documentação: lacunas](#8-documentação-lacunas)
9. [API Go: bugs e riscos](#9-api-go-bugs-e-riscos)
10. [API Go: organização e padronização](#10-api-go-organização-e-padronização)
11. [API Go: testes e infra](#11-api-go-testes-e-infra)
12. [Front: bugs](#12-front-bugs)
13. [Front: aderência ao padrão de componentes](#13-front-aderência-ao-padrão-de-componentes)
14. [Front: `cn()`, tokens e CSS](#14-front-cn-tokens-e-css)
15. [Front: dados, erros e estado](#15-front-dados-erros-e-estado)
16. [Front: acessibilidade](#16-front-acessibilidade)
17. [Front: nomes, código morto e testes](#17-front-nomes-código-morto-e-testes)
18. [Plano de ataque sugerido](#18-plano-de-ataque-sugerido)

---

## 1. Resumo executivo

### O que está bom

- **API Go bem estruturada.** As camadas `handler → service → repository` são claras e usam injeção de dependência. A API não importa nada de `ingest/*` (confirmado por `go list -deps`). Há graceful shutdown, timeouts e logging estruturado.
- **Qualidade verificável na API.** `gofmt`, `go vet` e `go mod tidy` limpos. A cobertura é de 86,4% e todos os testes passam.
- **Front com padrão visível.** O padrão Agnóstico + Wrappers está bem executado em `search/` e `profile/`. O `Callout` é um bom exemplo de Scoped-Variable. Há 299 testes passando, `tsc` sem erros, nenhum `any` fora de testes e testes escritos por `getByRole`.
- **Tipos do front espelham os modelos Go.** Não foi achada divergência de campo.
- **Documentação com boa filosofia.** `00.guidelines.md` (simplicidade primeiro, regra dos dois usos) e `01.component-composition.md` são bons guias.

### O que preocupa

O código é mais consistente do que a documentação. O problema principal é **deriva**: a documentação, os `AGENTS.md`, o README, o `.env.example`, o CI e o código foram mudando em ritmos diferentes e hoje se contradizem.

| Tema | Gravidade | Resumo |
|---|---|---|
| Fonte única da verdade | Alta | As regras de front estão repetidas em 4 lugares, e as cópias divergem. |
| Docs da API | Alta | `20.api.md` contradiz o comportamento real (`q` de IES, `exact`, endpoints sem doc). |
| CI | Alta | Só verifica formatação. Não roda testes, `go vet`, `tsc` nem build. E a formatação do front já falha hoje. |
| Segredos e lixo na raiz | Alta | `ss.json` tem API key em claro. Há scripts duplicados e um hook quebrado. |
| Regras do projeto não cumpridas | Média | Template literals em `className`, tokens inexistentes, cores cruas, `ProfileIES`. |
| Ingestão | Alta | Risco de loop infinito com arquivo truncado e de ingestão parcial dada como completa. |
| Licença | Alta | `LICENSE` é GPL v3. O README cita AGPL. |

---

## 2. Verificações automáticas

Resultados medidos durante a análise. O `podman` não funcionou neste container (erro de `newuidmap`). Os comandos rodaram com os binários locais, fora do fluxo `podman exec` do `AGENTS.md`.

| Verificação | Resultado |
|---|---|
| Go `gofmt -s -l` | OK |
| Go `go vet ./...` | OK |
| Go `go test ./...` | OK, cobertura de 86,4% |
| Go `go mod tidy -diff` | OK |
| Go `go test -race` | Não rodou (exige cgo) |
| Front `tsc --noEmit` | OK |
| Front `vitest run` | OK, 58 arquivos e 299 testes |
| Front `biome check` | **FALHA**: 3 arquivos |
| Integração com Elasticsearch real | Não existe nenhum teste |


---

## 3. Repositório, raiz e segredos

### Diagnóstico

- **`ss.json`** (raiz, ignorado pelo git) guarda um header `Authorization: ApiKey ...` em texto claro. Os scripts de consulta o usam.
- **Scripts soltos na raiz** (`get_curso.sh`, `random_curso.sh`, `random_ies.sh`, `query.json`, `query2.json`):
  - `get_curso.sh` e `random_curso.sh` são idênticos.
  - `query.json` consulta o campo `_ie`, que não existe no mapping.
  - Todos são ignorados pelo `.gitignore`, então só existem nesta máquina e não estão documentados.
- **`.gitignore` bloqueia o lugar certo para scripts.** Ele ignora `scripts/` (linha 8), então uma pasta `scripts/` versionada seria descartada.
- **`.gitignore` tem erros pequenos:**
  - `.env` (linha 11) e `.env*` (linha 59) são redundantes.
  - `.env*` esconde `.env.example`, que só está versionado porque foi adicionado à força. Falta `!.env.example`.
  - `front/node_modules/` é um caminho antigo.
  - `tasks` (sem barra) ignora qualquer arquivo ou pasta com esse nome.
  - O arquivo tem permissão de execução.
  - `/data/` é ignorado inteiro. Quem clona não recebe nem as amostras que o `10.database.md` referencia.
- **`.githooks/pre-commit` está quebrado e não é usado.**
  - Mexe em `.claude-plugin/*.json`, que não existem.
  - Usa `sed -i ''`, sintaxe de macOS.
  - `core.hooksPath` não está configurado.
  - Parece copiado de outro projeto.
- **`husky` e `lint-staged`** estão em `packages/front/package.json`, mas não há `.husky/` nem configuração. São dependências mortas.
- **Variável de ambiente renomeada pela metade.**
  - `.env.example:6` define `ELASTICSEARCH_BULKER_APIKEY`.
  - `docker-compose.yml:61`, `docker-compose.prod.yml:98` e `setup.sh:84` usam `ELASTICSEARCH_BULK_APIKEY`.
  - Quem copiar o `.env.example` preenche a variável errada.
- **`.env.example` está incompleto.** Faltam `PORT`, `ES_NUM_WORKERS`, `ES_FLUSH_BYTES`, `ES_FLUSH_INTERVAL_SEC`, `IMAGE_TAG`, `ES_HOST_URL`, `API_URL` e `NEXT_PUBLIC_API_URL`. Ele também traz uma senha fixa para `ELASTIC_PASSWORD`, que o `setup.sh` copia para o `.env`.
- **`setup.sh`** tem 955 linhas na raiz. Restaram nomes do rename `bulk`/`bulker` com caixa misturada (`bulk_INDEX_PATTERN`, `SKIP_bulk`). A ausência de `data/dados_curso_completo.json` vira só um aviso, e o script segue em frente.
- **Compose:**
  - `se_api` recebe `ES_USERNAME` e `ES_PASSWORD`, mas `config.Load()` não os lê.
  - O front em produção publica `3000:3000` sem `127.0.0.1`, ao contrário do ES e da API.
  - O dev não tem `ulimits.memlock`, embora use `bootstrap.memory_lock=true`.
  - Indentação inconsistente no bloco `data_net:` do dev.
- **Sujeira de disco (ignorada pelo git, mas confunde):** `packages/front/storybook-static/` desatualizado, `.next/`, `packages/api/tmp/`, `debug-storybook.log`, `tsconfig.tsbuildinfo`.
- **Árvore de trabalho com mudanças soltas:** o `AGENTS.md` foi alterado, e há uma refatoração do Enade em andamento (SVGs removidos, `conceito-enade.tsx` ainda não rastreado).
- **Branches remotos acumulados** em dois remotes (`origin` e `oficial`), sem convenção documentada. O README aponta para `github.com/souciencia/sou_estudante`, e o remote `origin` pode ser outro.

### Checklist

- [ **NÃO FAZER** ] **P0** Rotacionar a API key que estava em `ss.json` se o arquivo já saiu desta máquina. Parar de usar sessão httpie com chave em claro.
- [ ] **P1** Decidir sobre `query2.json`: documentar ou apagar. *(Pendente. Continua na raiz e ignorado.)*
- [ ] **P1** Remover `husky` e `lint-staged` do `package.json`. *(Pendente. O `.githooks/pre-commit` quebrado já foi removido, e a decisão foi não ter hook local, pois o CI já checa formatação. Os dois Dockerfiles usam `npm ci`, que falha se `package.json` e `package-lock.json` divergirem, e não dá para rodar `npm` neste container. Rodar no container do front: `podman exec -it se_front npm uninstall husky lint-staged`.)*
- [ ] **P2** Publicar o front de produção em `127.0.0.1:3000` se houver proxy reverso na frente. *(Pendente: depende de saber se há proxy reverso na frente.)*
- [ **NÃO FAZER** ] **P2** Versionar uma amostra pequena em `data/` (ex.: `amostra_dados.json`, `amostra_ies.json`, que são pequenos) com `!data/amostra_*.json`, para os links do `10.database.md` funcionarem num clone limpo.
- [ **NÃO FAZER** ] **P2** Commitar ou descartar as mudanças soltas antes de novas tarefas. Definir uma convenção de nome de branch e limpar branches antigos.

---

## 4. CI/CD e tooling

### Diagnóstico

- `.github/workflows/lint.yml` só confere formatação (`biome ci` e `gofmt -l`). Não roda `go vet`, `go test`, `vitest`, `tsc`, `next build` nem o build do Storybook.
- O workflow de deploy só depende do lint. Nenhum teste protege a `main`.
- **Versão do Go desalinhada:**
  - `go.mod` e CI usam 1.22 (`toolchain go1.22.12`).
  - Os três Dockerfiles do `api` usam 1.22.
  - O `packages/api/AGENTS.md` fala em 1.27.1 (mise).
  - Nenhum documento justifica a diferença.
- `deploy.yml` fixa `/var/www/sou_estudante`, depende de um `.env` colocado à mão no servidor, não roda o seed e não tem rollback. Nada disso está documentado.
- Versões de actions (`checkout@v7`, `setup-node@v7`, `setup-go@v7`) merecem conferência.
- `package.json` do front não tem scripts `typecheck`, `lint:fix` nem `test:ci`. O `build` define `NODE_ENV=production` manualmente, o que o Next desaconselha.
- Versões do Storybook desalinhadas (`addon-a11y` 10.5.0 contra `storybook` 10.6.0). `@types/testing-library__react` é obsoleto. O `a11y.test` do Storybook está em `'todo'`, então violações não falham o build. `addon-onboarding` continua ativo.
- `tsconfig.json` do front tem `include` com `src/app/discovering` (pasta inexistente) e uma entrada redundante de story.
- Nenhum teste ou regra garante a separação leitura/escrita da API.

### Checklist

- [ ] **P2** Subir `a11y.test` do Storybook de `'todo'` para `'error'`. *(Pendente, de propósito: `'warn'` não existe, os valores são `off`, `todo` e `error`. Além disso, `'error'` só falha algo quando as stories rodam pelo addon Vitest ou pelo test-runner, e nenhum dos dois está instalado, então mudar o valor hoje não teria efeito no CI. Há também violações de a11y conhecidas (seção 16). Faz mais sentido depois de corrigi-las.)*
- [ ] **P2** Alinhar as versões do Storybook (`addon-a11y`, `addon-docs`, `nextjs-vite` em 10.5.0, `storybook` e `cli` em 10.6.0) e remover `@types/testing-library__react`. *(Pendente: exige `npm` e atualização do lockfile, e não posso rodar `npm` neste container. No container do front: `podman exec -it se_front npm install -D @storybook/addon-a11y@^10.6.0 @storybook/addon-docs@^10.6.0 @storybook/nextjs-vite@^10.6.0 storybook@^10.6.0` e `npm uninstall @types/testing-library__react`.)*

---

## 5. Documentação: links e estrutura de `docs/`

### Diagnóstico

Arquivos em `docs/`: `00.guidelines.md`, `01.component-composition.md`, `10.database.md`, `20.api.md`, `30.frontend.md`, `tdd-specs/{tests,mocking}.md` e `imgs/` (vazia e ignorada).

**Referências quebradas:**

| Onde | Aponta para | Problema |
|---|---|---|
| `packages/front/AGENTS.md:17` | `docs/03.frontend.md` | Foi renomeado para `30.frontend.md`. |
| `packages/front/AGENTS.md:51` | `@/lib/utils` | O `cn()` real fica em `@/utils/cn`. |
| `packages/front/AGENTS.md` | skill `/tailwind-cn-utility` | Não existe. |
| `AGENTS.md:21` | arquivos `docs/tarefa-...` | Nenhum existe. Foram removidos em commits anteriores. |
| `README.md` (linhas 75-76) | skills `coding-and-refactoring` e `tdd` | Só existe a skill `accessibility`. |
| `.opencode/skills/accessibility/SKILL.md` (linhas 7-10) | `acessibility/`, `ocus-navigation.md`, `keyboard-support.md` | Typos nos caminhos. O arquivo real é `keyboard-suppport.md` (3 "p"). |
| `mask-enade.tsx:4` | `docs/imgs/exemplo_mask.png` | `docs/imgs/` está vazia e ignorada. |
| `filters-panel-cursos.test.tsx:40` | `docs/filtros.md` | Não existe. |
| `docs/10.database.md` | `data/amostra_*.json` | `data/` é ignorado. Não resolve num clone limpo. |

**Estrutura e nomes:**

- O esquema de numeração `00`, `01`, `10`, `20`, `30` não é explicado em lugar nenhum.
- Se a ideia for "dezena por pacote" (10 DB, 20 API, 30 front), então `01.component-composition.md` pertence ao front e deveria estar na série 30.
- Idiomas misturados: nomes de arquivo em inglês, corpo em português, e `tdd-specs/` inteira em inglês e sem numeração.
- `20.api.md` tem dois títulos H1 (linhas 1 e 199).
- O `opencode.json` carrega `packages/*/AGENTS.md` e `docs/00.guidelines.md` como instruções, mas não `30.frontend.md` nem `20.api.md`. Quem depende dessas instruções pode não ver as regras detalhadas.

### Checklist

- [ **NÃO FAZER** ] **P1** Resolver `docs/imgs/`: versionar a imagem (e tirar `docs/imgs/` do `.gitignore`), ou remover a referência em `mask-enade.tsx`. Remover a menção a `docs/filtros.md` no teste.
- [ **NÃO FAZER** ] **P1** Registrar em `docs/README.md` (índice) a lógica de numeração, e mover `01.component-composition.md` para a série 30 ou justificar.
- [ **NÃO FAZER** ] **P2** Fazer um teste ou script de CI que verifique links relativos em `.md` (ex.: `lychee` ou `markdown-link-check`) para evitar nova quebra após renomeações.
- [ **NÃO FAZER** ] **P2** Incluir `20.api.md` e `30.frontend.md` nas `instructions` do `opencode.json`, ou garantir que os `AGENTS.md` os referenciem de forma legível.

---

## 6. Documentação: conteúdo desatualizado

### `docs/20.api.md` (o mais defasado)

- O título diz "Módulo de Cursos", mas o arquivo também cobre IES.
- **Endpoints sem documentação:** `GET /cursos/{id}`, `GET /cursos/sugestoes`, `GET /healthz`.
- **`GET /ies`:** o doc diz que `q` é opcional (linha 221). O código devolve 400 se `q` faltar (`ies/handler.go:25`, mais teste). Decidir qual está certo (ver seção 9).
- **Parâmetro `exact`** de `GET /cursos` (padrão `true`) não está documentado.
- **Diagrama de `Enade`:** usa `format_conceito_continuo_enade`. O código e o banco usam `conceito_continuo_enade`.
- **Diagrama de `Instituicao`:** mostra só `co_ies`. O código também tem `no_ies`, `sg_ies`, `categoria_administrativa` e `organizacao_academica`.
- **`limit`:** o doc diz máximo 100. O código volta ao padrão (20) quando passa de 100, em vez de limitar a 100. Em sugestões o limite é 20.
- **`sort` de IES:** o código aceita também `_score`. O doc só cita `relevancia`.
- Faltam: formato de erro (`{"error": "..."}`), CORS, `X-Request-Id` e os valores reais aceitos em `grau` e `turno`. O front envia `Bacharelado` com maiúscula e a API pode casar de forma diferente (ver seção 9).

### `docs/10.database.md`

- Typo "bando de dados" (linha 3).
- Fala em "etapa de bulking" e "indexado pelo bulk". Hoje é `cmd/seed` e `internal/ingest/seed`.
- Os exemplos JSON são inválidos: têm comentários `//` e uma vírgula sobrando antes de `]` (linha 115). Não dá para copiar.
- Falta o que está nos mappings: `sisu.ofertas` é `nested`, os dicionários usam `search_as_you_type`, `dynamic: strict`. O `_id` de `cursos` não é descrito, e `GET /cursos/{id}` depende dele.
- Os papéis das API keys (leitura e ingestão) estão no `AGENTS.md` e no `setup.sh`, mas não aqui.

### `docs/30.frontend.md` e `packages/front/AGENTS.md`

- Citam a pasta `home/`, que não existe. `Hero` e `HomeSearch` estão em `layout/`.
- Citam `layout/site-menu`. O código tem `layout/menu`.
- O doc manda usar o sufixo `Ies` ("nunca `IES`", `30:82`), mas o código usa `ProfileIES` (ver seção 13).
- O exemplo de tokens do `AGENTS.md` (`--module-color`, `--color-module-3`, `--{component}-{property}-module-{N}`) não existe no código. O código usa `--color-mN-accent`, `--color-accent` e `[data-module]`, como no `30.frontend.md`.
- A lista de tokens de tipografia do doc não bate com `globals.css`, que tem também `--text-coadjuvant-xxs`, `--text-protagonist-2xl`, `--radius-callout`, `--color-callout-*` e `--font-display`.
- Não cita os loaders (`ProfileCursosLoader` etc.).
- O doc diz que não se replicam valores de tokens fora do `globals.css`, mas lista nomes que já divergem dele.

### `README.md`

- Fluxo de execução: `docker compose build → ./setup.sh → docker compose up -d`. Não explica que o `setup.sh` já sobe o ES e roda o seed, nem que os dados precisam estar em `data/`.
- "Frontend (construção em estágio inicial)": já há 5 rotas e Storybook.
- Estrutura do front citada (`atoms / features / site-blocks`) não existe. O código usa `ui / layout / search / profile / enade`.
- A frase sobre prefixo de branch está incompleta.
- **Licença:** o texto em português é da GPL. O trecho em inglês é da **AGPL**. O arquivo `LICENSE` é **GPL v3**. Há também lixo no fim (`**` solto na linha 90, `.` na linha 108).
- Só fala de `docker compose`, enquanto o `AGENTS.md` exige `podman exec` e o deploy usa `podman compose`.

### `packages/api/AGENTS.md`

- A árvore não lista `internal/ingest/textcase` nem `internal/testutil`.

### Checklist

- [ ] **P2** Para a API, considerar gerar a documentação a partir de um contrato (OpenAPI) em vez de manter diagramas à mão. É o que mais reduziria a deriva. *(Pendente por decisão sua: adiado. Por ora o `20.api.md` segue manual.)*

---

## 7. Documentação: contradições e duplicações

### Contradições entre documentos

| # | Tema | Contradição |
|---|---|---|
| 1 | Terminologia | `01:155` proíbe chamar o agnóstico de "raiz". `30:29` escreve "Agnóstico (raiz)". |
| 2 | Quando subir lógica | `01:123-125` só sobe quando 2 wrappers já a usam. `30:32` sobe sem essa condição. |
| 3 | Tokens de módulo | `front/AGENTS.md`: `--{component}-{property}-module-{N}`. `30:117` e `globals.css`: `--color-mN-accent`. |
| 4 | Sufixo de domínio | `30:82`: "`Ies`, nunca `IES`". O código e uma story usam `IES`. |
| 5 | Títulos do Storybook | `30:104` define `Components/<Área>/<Nome>`. Existem `Components/Layouts/...`, `Components/Shapes/...` e títulos com espaço. |
| 6 | Nomes de arquivo | `00:30` manda `<nome>.<papel>.ts`. `30` e `01` mandam `<pai>-<parte>.tsx`. O front mistura os dois. Não há regra para Go. |
| 7 | Testes | `tdd-specs/tests.md:32` usa `jest.mock`, mas o front usa Vitest. Não há exemplos para Go. |
| 8 | Ciclo de TDD | `00:49` promete etapas extras no doc do pacote (ex.: stories). `30.frontend.md` não as define. |
| 9 | Container | README usa Docker. `AGENTS.md` exige Podman. |

### Duplicações

- **Compound Component** está em `README`, `front/AGENTS.md`, `30.frontend.md` e `01.component-composition.md`. O bloco `Object.assign` está idêntico em dois deles.
- **Agnóstico + Wrappers** está em `front/AGENTS.md`, `30` e `01`. As três versões divergem.
- **DRY** aparece 3 vezes em `README`, `front/AGENTS.md` e `00`.
- **Regras de `cn()`** estão em `front/AGENTS.md` e `30`.
- **Estrutura de pastas do front** tem três versões diferentes.

---

## 8. Documentação: lacunas

### Diagnóstico

- Nada ensina como rodar os testes: Go (que usa `httptest`, sem ES) e front (`npm run test:run`).
- Faltam `README.md` dentro de `packages/api` e `packages/front`.
- Faltam `CONTRIBUTING.md`, templates de PR e issue, e registro de decisões (ADR). Decisões que mereciam registro:
  - por que Go + Elasticsearch;
  - por que a ingestão virou `cmd/seed`;
  - política das API keys (leitura contra ingestão);
  - fetch só no cliente.
- Falta um diagrama de arquitetura (`front → rewrite /api → se_api → ES`) e a descrição do seed (idempotência, dicionários).
- Falta um glossário do domínio: CINE, TDA, TAP, TCA, Sisu, Enade, faixa e módulos 1-5.
- Falta explicar `API_URL` e `NEXT_PUBLIC_API_URL`, e a diferença entre dev e prod (portas, Dockerfile, `output: standalone`).
- A skill de acessibilidade existe, mas nenhum documento em `docs/` a cita.
- Rotas `/ingresso`, `/permanencia` e `/comparar` são páginas stub, sem nenhum aviso.

### Checklist

- [ ] **P1** Criar `docs/README.md` como índice: lista de documentos, ordem de leitura e esquema de numeração. *(Não criado, por decisão sua (mantém o veto da seção 5). O README da raiz lista os documentos.)*
- [ ] **P1** Criar `docs/40.operacao.md` (nome ilustrativo): setup, variáveis de ambiente, dados, `setup.sh`, dev contra prod, deploy. *(Parcial: só a seção de deploy existe. Setup local, variáveis e dev contra prod não foram escritos em `40` (você não os escolheu); setup e dados estão no README, e dev x prod e `API_URL` em `00.arquitetura.md`.)*
- [ ] **P2** Criar `CONTRIBUTING.md` com branch, commit, PR e checklist de revisão. Citar a skill de acessibilidade como parte do checklist de UI. *(Não feito (não selecionado). O README já traz o fluxo de PR.)*
- [ ] **P2** Marcar visualmente as rotas ainda não implementadas ou tirá-las da navegação. *(Não feito (não selecionado; mexe no UI). O README e `00.arquitetura.md` avisam que as rotas ainda são stubs.)*

---

## 9. API Go: bugs e riscos

Os itens abaixo vieram da leitura do código. O ES real não foi consultado.

### Alta prioridade

- [x] **P0** **Ingestão parcial é dada como completa.** Resolvido por troca atômica de índice (blue/green). A ingestão indexa num índice novo `<nome>-latest` e aponta o alias `<nome>` para ele ao final, apagando o antigo. Se a ingestão falhar, o alias continua no índice anterior, íntegro. Os dicionários seguem o mesmo fluxo (`<nome>-latest` + alias), corrigindo também a defasagem. *(Resolvido em 2026-10-11. Helpers `AliasIndices`/`PointAlias` em `internal/ingest/bulk/alias.go`.)*
- [x] **P0** **Filtro de turno `integral` provavelmente nunca casa.** Resolvido em código: `sisu.ofertas.turno` é `nested`, então as cláusulas viraram consultas `nested`, e os valores passaram para a caixa de título gravada (`Noturno`, `Matutino`, `Vespertino`, `Integral`), em vez de maiúsculas. `diurno` agrupa `Matutino`/`Vespertino` num único `terms` nested. *(Corrigido em 2026-10-11, com testes em `buildFilterClauses`. Falta validar o filtro e o bucket "Integral" contra um ES real.)*

### Média prioridade

- [ ] **P1** **`GET /ies` exige `q`, mas o doc diz que é opcional.** O ramo `match_all` de `ies/repository.go:49-54` e o teste `TestSearchTermoVazioUsaMatchAll` são inalcançáveis pela API. Decidir o comportamento desejado e alinhar código, teste e doc. *(Decidido na seção 6 (doc segue o código). O ramo `match_all` morto do repositório continua; é da seção 10.)*
- [ ] **P1** **Paginação profunda vira erro 500.** Nada limita `page * limit` a `index.max_result_window` (10.000). O erro 4xx do ES chega ao cliente como 500. Devolver 400. *(Não selecionado nesta rodada.)*
- [x] **P1** Sem `exact`, `grau=bacharelado` em minúsculas pode não casar com `"Bacharelado"` gravado. Resolvido: o filtro de `grau` normaliza a caixa com `textcase.Title` (o mesmo usado na ingestão). O nome de modalidade também passou de maiúsculas para a caixa de título. *(Corrigido em 2026-10-11. O `textcase` foi movido de `internal/ingest/textcase` para `internal/textcase`, para a API poder usá-lo sem importar o lado de escrita.)*

### Baixa prioridade

- [ ] **P2** `main.go:27` loga "Falha ao conectar", mas `NewClient` não conecta. `/healthz` é só liveness e não consulta o ES. Considerar um `/readyz`. *(Adiado por decisão sua: baixa prioridade.)*
- [ ] **P2** `main.go:44`: usar `errors.Is(err, http.ErrServerClosed)`. O nível do log é fixo em Info. *(Adiado por decisão sua: baixa prioridade.)*
- [ ] **P2** CORS: `Allow-Origin: *` fixo, sem `Vary`, preflight com 200 em vez de 204, sem `Max-Age`. *(Adiado por decisão sua: baixa prioridade.)*
- [ ] **P2** Middlewares: o `statusRecorder` não implementa `Flush`/`Unwrap`. O `recover` não trata `http.ErrAbortHandler` e pode chamar `WriteHeader` duas vezes. O `X-Request-Id` recebido não é validado nem limitado. O `AccessLog` não registra a query. Os logs de erro dos handlers não incluem o `request_id`. *(Adiado por decisão sua: baixa prioridade.)*
- [ ] **P2** `seed`: se faltar a IES de um curso, `info` vem vazio sem aviso (`cursos/ingest/stream.go:32`). *(Adiado por decisão sua: baixa prioridade. A janela vazia do dicionário foi resolvida junto com o P0 de ingestão, na troca por alias.)*

---

## 10. API Go: organização e padronização

### Diagnóstico

As duplicações entre `cursos` e `ies` foram tratadas, e o diagnóstico original estava em boa parte desatualizado:

- **Paginação:** `httpx.ParsePagination` e `NormalizePagination` são o único ponto de leitura e normalização, usados pelos handlers e services das duas features.
- **Acesso ao Elasticsearch:** `elasticsearch.ExecuteSearch[T]`, `GetByID[T]` e `ParseBuckets` são genéricos e compartilhados, e as features usam aliases dos tipos `AggregationBucket` e `PaginationLinks`.
- **Query DSL:** `elasticsearch/query.go` reúne os builders usados pelos dois repositórios (`TermsFilter`, `UpperTermsFilter`, `AnyOf`, `TermsAgg`, `FiltersAgg`, `CategoriaFilter`, `CategoriaAnyOf`, `CategoriasAgg` e `SearchBody`). Os campos e as regras de cada feature continuam nos próprios repositórios.
- **Links de paginação:** `httpx.SetCSV` serializa as listas de filtros nos dois `*FilterValues`.
- **Testes:** `testutil.DecodeJSONObject` e `testutil.WriteTempFile` substituíram as cópias de `decodeRequest`, `decodeSugestoesRequest` e `writeSourceFile`.
- **Sugestões:** um único repositório parametrizado por índice e campo.
- **Código morto e nomes:** o ramo `match_all` de IES, `interface{}` e `models.go` não existem mais.

O que ficou separado de propósito: `ErrNotFound`, `SearchResult`, `DetailHandler` e as structs de resposta continuam por feature, porque cada uma tem tipo e mensagem próprios, e uma versão genérica esconderia o contrato da API sem resolver uma dor real. Os leitores de ingestão também ficam separados, pois leem formatos diferentes (array JSON e NDJSON).

Ponto de atenção: o `cmd/seed` importa as features `cursos` e `ies` inteiras, porque o `model.go` delas vive no mesmo pacote que o handler e o repository. Por isso qualquer helper novo em `httpx` ou `elasticsearch` também entra no binário do seed. Os builders de query ficaram em `elasticsearch`, e não em `internal/ingest`, para a API continuar sem importar o lado de escrita (`cmd/api/deps_test.go`).

### Checklist

Nenhum item pendente.

---

## 11. API Go: testes e infra

### Diagnóstico

- 28 arquivos de teste e cerca de 190 funções. Tudo com `httptest`, sem ES real, sem build tags e sem `t.Parallel`.
- **Sem cobertura:** `cmd/seed`, `main()` da API, `testutil` e `apperr` (que tem uma linha de código).
- **Cobertura baixa por função:** `cursos.buildFilterClauses` 57,6%, `buildSortClauses` 60%, `modalidadeShouldClauses` 66,7%, `seed.run` 70,4%, `seed.defaultDeps` 20%.
- Faltam testes de turno, grau, categoria e ordenações `enade` e `desistencia`; de arquivo truncado; e de falha parcial de ingestão.
- **Pontos positivos:** `mappings_test.go` confere por reflexão se o mapping cobre as structs, e há testes de router (405, CORS, rota literal contra coringa).
- **Dockerfiles:**
  - Produção: bom, mas sem `HEALTHCHECK` (o `/healthz` existe) e sem `go vet`/`go test` no build.
  - `Dockerfile.seed`: roda como root, ao contrário do de produção.
  - `Dockerfile.dev`: `COPY . .` antes de baixar dependências (sem cache de camadas) e `RUN go mod tidy` no build, que altera o `go.mod` na imagem e exige rede. Roda como root.
- Sem `Makefile` nem outro ponto de entrada de comandos.

### Checklist

- [ ] **P2** Decidir se vale ter 1-2 testes de integração com ES (taggeados, rodando só no CI ou sob demanda), já que o maior risco (mappings `nested`, caixa de `keyword`) só aparece contra um ES real. *(Pendente: não há Elasticsearch acessível aqui para escrever e validar. É o único jeito de cobrir o risco do filtro de turno (`nested`, caixa de `keyword`); recomendo fazer quando houver um ES de teste (por exemplo, serviço no CI).)*

---

## 12. Front: bugs

- [ ] **P2** `PageTransition` usa `key={pathname}` dentro de `template.tsx`, que já remonta a cada navegação. *(Não feito: não consigo verificar a animação sem navegador, e o comentário do componente afirma que a `key` evita reanimar/duplicar. Remover exige teste visual.)*

---

## 13. Front: aderência ao padrão de componentes

### Diagnóstico

Esta seção foi resolvida por completo. Estado atual:

- **`SearchAutocomplete`** recebe o hook como prop, e o domínio entra por `SearchAutocompleteCursos`.
- **Callout:** a versão legada (`ui/callout/callout.tsx`) foi apagada, e `profile-ingresso` e `profile-cursos-quality` usam o `Callout` compound.
- **Contextos:** os de `SearchHeader` e `Card` foram removidos, e o `data-module` é herdado. O `ProfileContext` permanece, porque o `Profile.Header` decide o `IconModule` em JS, e a regra do módulo sem ícone é a constante `MODULE_WITHOUT_ICON`.
- **Compounds grandes:** `Profile` (9 partes) e `Callout` (7) têm a exceção justificada no `index.tsx`. `Card` tem 6.
- **Camadas e props de teste:** `search-result-section/`, a prop `hasSearched` e o `export default` de `ProfileSkeleton` foram removidos. A dependência de `layout-search-page` em `SearchGate` está documentada em comentário.
- **Nomenclatura:** `ProfileIES*` é exceção registrada no `30.frontend.md`, e `hero/`, `home-search/` e `menu/` ficam em `layout/`, como o documento descreve.
- **Loaders de perfil:** os três (`cursos`, `ies` e `ingresso`) usam o `ProfileLoader` (spinner, 404 e erro, com "Voltar à busca"). O caso "curso sem Sisu" do ingresso é tratado como "não encontrado" com texto próprio. O `ProfileSkeleton` e o CSS `.esqueleto`, que só ele usava, foram removidos.

### Checklist

Nenhum item pendente.

---

## 14. Front: `cn()`, tokens e CSS

### Diagnóstico

A maior parte da seção foi resolvida. Template literals em `className`, paleta crua do Tailwind, hex e acentos duplicados nos componentes, raios fixos, o `Typo` divergente e o `hero.tsx` gigante já foram tratados. A nomenclatura `protagonist`/`coadjuvant` foi substituída por tokens neutros:

- Tamanhos: escala padrão do Tailwind (`text-xs` 12px como piso, `text-sm`, `text-base`, `text-xl`, `text-4xl`) mais `text-display` e `text-2xs` (10px, exceção só para texto complementar).
- Fontes: `font-sans` (corpo) e `font-display` (títulos).
- Cores de texto: `text-fg` e `text-fg-muted`, que absorveram `text-text*` e `fg-protagonist`/`fg-coadjuvant`.

O `cn.ts` agora só registra `text-display` e os raios. Os 2 `text-[clamp(...)]` (`app/page.tsx`, `layout/hero/hero.tsx`) ficam como exceção, por decisão sua.

**Ainda aberto (baixa prioridade):**

- 27 `tracking-[...]` arbitrários e 6 `border-[1.5px]`, sem token.
- `Typo` mapeia `md` e `lg` para a mesma classe (`text-base`), e `lg` não tem uso.
- Muitos `font-sans` explícitos são redundantes, porque o `body` já aplica a fonte. Podem ser podados.
- O comentário de `--font-display` no `globals.css` não diz que ele tem o mesmo valor de `--font-sans`. Se a intenção é uma fonte de títulos diferente, ela ainda não existe.

### Checklist

- [ ] **P2** Decidir o destino dos `tracking-[...]` (token ou exceção documentada).

---

## 15. Front: dados, erros e estado

### Diagnóstico

Esta seção foi resolvida por completo. Estado atual:

- **Erros de busca chegam à UI.** `apiClient` devolve `Result`, `useSearch` lança o erro e `SearchResults` mostra a mensagem de `ERROR_MESSAGES`.
- **Uma busca por rota.** `useSearch` usa React Query (`providers.tsx`), com chave de cache compartilhada entre os componentes da página, no lugar dos 5 fetches idênticos.
- **Páginas de estado:** `app/error.tsx`, `loading.tsx`, `not-found.tsx` e `global-error.tsx` existem.
- **SEO:** as rotas `[id]` têm `generateMetadata`, com fetch no servidor (`services/api/server.ts`).
- **Ambiente:** `NEXT_PUBLIC_API_URL` deve ficar ausente, para dev e produção usarem o proxy `/api`. Isso está no `.env.example` do front e na `00.arquitetura.md`.
- **Duplicações removidas:** `use-resource.ts`, `search-params.ts` e um único `SugestoesResponse`.
- **Filtros:** as 27 UFs vêm de `lib/uf.ts`, `CATEGORIAS_ADMINISTRATIVAS` é compartilhada e `getAggregationCount` usa igualdade exata normalizada.
- **Detalhes:** o barrel `services/api` reexporta os hooks, o `ERROR_MESSAGES.client` usa `SEARCH_MIN_CHARS`, o estado derivado do autocomplete é calculado na renderização e `'use client'` só permanece onde há hook, evento ou contexto.

### Checklist

Nenhum item pendente.

---

## 16. Front: acessibilidade

### Diagnóstico

O projeto tem uma skill de acessibilidade (WCAG 2.1 AA) e os desvios apontados na análise foram corrigidos no código:

- um único `<main>` (em `layout-site`);
- foco visível com `accent-deep` em filtros, autocomplete e `Switch`;
- `SortingOptions` com `role="group"`, rótulo e `aria-pressed`;
- IDs dos filtros gerados com `useId`;
- `Card.Title` com nível de título configurável;
- `ErrorMessage` só com `role="alert"`;
- uma única região viva nos skeletons de resultados;
- combobox com live region que anuncia a quantidade de sugestões;
- link do card com `aria-label` curto;
- rodapé com contraste de 4,5:1;
- `tabpanel` do `Profile` com `tabIndex={0}`, conforme o padrão ARIA (com `biome-ignore` justificado);
- a skill é citada no `30.frontend.md`.

O que sobra depende de `npm`, que não roda neste container.

### Checklist

- [ ] **P2** Declarar `@testing-library/user-event` no `package.json`. O `menu.test.tsx` já o importa, mas ele só resolve por estar hoisted no `node_modules`, sem estar declarado. Depois, trocar `fireEvent` por `user-event` nos testes de interação (hoje 18 arquivos usam `fireEvent` e 1 usa `user-event`). *(Pendente: exige `npm`. No container do front: `podman exec -it se_front npm install -D @testing-library/user-event`.)*
- [ ] **P2** Adicionar `jest-axe` (ou equivalente) aos testes dos componentes principais. *(Pendente: exige `npm`. No container do front: `podman exec -it se_front npm install -D jest-axe @types/jest-axe`.)*
- [ ] **P2** Subir `a11y.test` do Storybook para `'error'` (seção 4). *(Pendente: só tem efeito com o addon Vitest ou o test-runner instalado.)*
- [ ] **P2** Citar a skill de acessibilidade no `CONTRIBUTING.md`. *(Não aplicável: o `CONTRIBUTING.md` não será criado, por decisão sua na seção 8.)*

---

## 17. Front: nomes, código morto e testes

### Diagnóstico

Quase toda a seção foi resolvida:

- código morto e comentários mortos removidos;
- arquivos em `kebab-case`, sem `index.test`/`index.stories` fora de `index.tsx`, sem `mar-jegenda` nem `instiuicao`;
- `export default` só onde o framework exige (rotas e `meta` das stories);
- títulos das stories no padrão `Components/<Área>/<Nome>`, e tipos importados de `@storybook/nextjs-vite`;
- páginas stub com o aviso `EmBreve`;
- identificadores em inglês: `paleta` virou `palette`, `paletaMar` virou `marPalette` (campos `color` e `background`), e `rotulo`, `numerica`, `botaoRef` e `aoTeclar` foram renomeados. Termos do domínio (`faixa`, `neblina`, `curso`, `ies`) ficam como exceção;
- o `ShellHeader` saiu de `layout/header/index.tsx` e está em `shell-header.tsx`;
- testes adicionados para `ShellHeader`, `ProfileIngressoShift`, `ProfileIngressoQuotas`, `ProfileCursosQuality` e `ProfileSection`. O teste de `ProfileIngressoQuotas` achou um bug real, em que `vagas` indefinido imprimia "undefined vagas". Foi corrigido.

Os componentes puramente visuais (`Typo`, `Spinner`, `SkeletonCard`, `ErrorMessage`, `ConceitoEnade`, `MarLegenda`, `BussolaHero`, `WavesShape`) ficam sem teste, por decisão: a cobertura deles é a story.

### Checklist

- [ ] **P2** Adicionar stories aos componentes que a regra do `30.frontend.md` exige e ainda não têm: `SearchPagination`, `SearchResultItem`, `CardFields`, `ErrorMessage`, `Spinner`, `Typo`, `SkeletonCard`, `ShellHeader`, `ProfileIngressoShift` e `ProfileIngressoQuotas`. Wrappers triviais e loaders ficam dispensados. *(Adiado por decisão sua: fica para depois.)*
- [ ] **P2** `formatNotaCorte` está duplicada em `profile-ingresso-shift.tsx` e `profile-ingresso-quotas.tsx`. É o segundo uso, então a regra dos dois usos pede extrair.

---

## 18. Plano de ataque sugerido

Esta seção foi conferida contra o estado real do repositório. Os itens concluídos foram apagados. Ficaram os pendentes, com a seção de origem entre parênteses.

### Fase 1: parar a hemorragia

- [ **NÃO FAZER** ] Rotacionar a API key de `ss.json` (seção 3).

### Fase 2: rede de proteção

- [ **NÃO FAZER** ] Verificador de links em `.md` (seção 5).
- [ ] Limpar raiz e dependências mortas (seção 3): remover `husky` e `lint-staged` do `package.json` (exige `npm`) e decidir sobre `query2.json`.

### Fase 3: corrigir risco funcional

- [ ] Validar contra um ES real o filtro de turno (nested) e o bucket "Integral" (seção 9). O código já está corrigido; falta a confirmação de dados.
- [ ] **Paginação profunda vira erro 500** (seção 9, P1): limitar `page * limit` a `index.max_result_window` (10.000) e devolver 400 em vez de 500.

### Fase 4: alinhar documentação

- [ ] Criar `docs/README.md` (seção 8) e completar o `40.operacao.md` com setup local, variáveis e dev contra prod. *(Vetado na seção 5, e o `40` só tem a parte de deploy.)*

### Fase 5: padronização do código (contínuo)

- [ ] Stories que faltam (seção 17).
- [ ] `tracking-[...]` arbitrários (seção 14).
- [ ] Restante da acessibilidade (seção 16): `jest-axe`, `user-event` e Storybook com `a11y.test: 'error'`. Exige `npm`.

### Para manter o projeto organizado depois

- [ ] Toda mudança de endpoint atualiza o contrato da API no mesmo PR.
- [ ] Toda renomeação de arquivo roda o verificador de links. *(Depende do verificador, que está em NÃO FAZER.)*
- [ ] Revisar este documento a cada marco, apagando os itens concluídos.
