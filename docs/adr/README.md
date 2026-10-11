# Registro de decisões de arquitetura (ADR)

Cada ADR registra uma decisão, o contexto e as consequências. Formato:
`NNNN-titulo-curto.md`, com os campos **Status**, **Decisão**, **Motivo**,
**Consequências**.

> Os ADRs 0001 a 0004 foram escritos a partir do que o código faz hoje
> (campos **Decisão** e **Consequências**). O campo **Motivo** está marcado
> *a preencher pelo time*: a razão original não consta no repositório e não foi
> inventada. Troque o status para "Aceito" depois de preenchê-lo.

| ADR | Título | Status |
| :--- | :--- | :--- |
| [0001](0001-go-e-elasticsearch.md) | API em Go sobre Elasticsearch | Rascunho |
| [0002](0002-ingestao-em-cmd-seed.md) | Ingestão como job separado (`cmd/seed`) | Rascunho |
| [0003](0003-api-keys-leitura-e-escrita.md) | API keys separadas para leitura e ingestão | Rascunho |
| [0004](0004-fetch-no-cliente.md) | Busca de dados no cliente (front) | Rascunho |
