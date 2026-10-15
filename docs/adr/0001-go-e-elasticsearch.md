# 0001. API em Go sobre Elasticsearch

**Status:** Rascunho

## Decisão

Os dados (cursos e IES) ficam no Elasticsearch 8.17, e a API HTTP é escrita em
Go (`net/http`, cliente `go-elasticsearch/v8`), organizada em
`handler → service → repository` por feature.

## Motivo

*A preencher pelo time.*

## Consequências (observadas no código)

- Busca textual com analisadores próprios (`brazilian_search`) e autocomplete
  (`search_as_you_type`) vêm do Elasticsearch; filtros e agregações da UI são
  consultas ao índice (ver [10.database.md](../10.database.md)).
- Mappings `dynamic: strict`: mudar a estrutura do documento exige atualizar o
  mapping e reindexar.
- Campos `keyword` diferenciam caixa, o que acopla os filtros à normalização
  feita na ingestão.
- Sem banco relacional: não há transações nem consistência entre índices.
