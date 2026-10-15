# 0003. API keys separadas para leitura e ingestão

**Status:** Rascunho

## Decisão

O `setup.sh` gera duas API keys do Elasticsearch com privilégio mínimo:
`ELASTICSEARCH_APIKEY` (somente leitura, usada pela API como `ES_APIKEY`) e
`ELASTICSEARCH_BULK_APIKEY` (leitura e escrita, usada só pelo seed como
`ES_INGEST_APIKEY`). O superusuário `elastic` é usado apenas pelo `setup.sh` e
pelo healthcheck do Elasticsearch.

## Motivo

*A preencher pelo time.*

## Consequências (observadas no código)

- Um comprometimento da API não permite escrever nos índices.
- O `.env` guarda credenciais sensíveis (permissão 600, fora do Git) e precisa
  ser criado à mão no servidor de produção.
- Com `ES_APIKEY` vazio a API fala com o Elasticsearch sem autenticação, sem
  aviso (ver seção 9 de [analise-sonnet.md](../analise-sonnet.md)).
