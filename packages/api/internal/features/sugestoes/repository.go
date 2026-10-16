package sugestoes

import (
	"context"
	"fmt"
	"strings"

	es "github.com/elastic/go-elasticsearch/v8"

	"api_estudante/internal/elasticsearch"
)

// Repository define contrato de acesso às sugestões de cursos
type Repository interface {
	BuscarSugestoes(ctx context.Context, termo string, limit int) ([]string, error)
}

// ElasticsearchRepository implementa Repository usando Elasticsearch
type ElasticsearchRepository struct {
	client  *es.Client
	index   string
	display string
	search  []string
}

// NewElasticsearchRepository cria nova instância do repository.
// index é o índice de dicionário, display é o campo de texto exibido na
// sugestão (ex.: "no_curso", "no_ies") e search são campos adicionais também
// consultados. O campo display é sempre incluído na busca; o autocomplete de
// IES, por exemplo, busca por "no_ies" e "sg_ies" mas devolve "no_ies".
func NewElasticsearchRepository(client *es.Client, index, display string, search ...string) Repository {
	return &ElasticsearchRepository{
		client:  client,
		index:   index,
		display: display,
		search:  append([]string{display}, search...),
	}
}

// exactMatchBoost eleva o match exato do termo digitado ao topo das sugestões,
// fazendo com que nomes idênticos (ignorando caixa e acentos) venham primeiro.
const exactMatchBoost = 100

// buildSugestoesQuery monta a query de sugestões: match exato com boost alto
// por campo, seguido do match por prefixo (bool_prefix) como fallback.
func buildSugestoesQuery(termo string, fields []string) map[string]any {
	should := make([]map[string]any, 0, len(fields)+1)
	for _, field := range fields {
		should = append(should, map[string]any{
			"term": map[string]any{
				field + ".exato": map[string]any{
					"value": termo,
					"boost": exactMatchBoost,
				},
			},
		})
	}
	should = append(should, map[string]any{
		"multi_match": map[string]any{
			"query":  termo,
			"type":   "bool_prefix",
			"fields": fields,
		},
	})

	return map[string]any{
		"bool": map[string]any{
			"should":               should,
			"minimum_should_match": 1,
		},
	}
}

// BuscarSugestoes consulta nomes no índice de dicionário priorizando o match
// exato e, em seguida, o match por prefixo.
func (r *ElasticsearchRepository) BuscarSugestoes(ctx context.Context, termo string, limit int) ([]string, error) {
	queryBody := map[string]any{
		"size":  limit,
		"query": buildSugestoesQuery(termo, r.search),
	}

	resp, err := elasticsearch.ExecuteSearch[map[string]string](ctx, r.client, r.index, queryBody)
	if err != nil {
		return nil, fmt.Errorf("erro ao consultar sugestões no elasticsearch: %w", err)
	}

	// Garantir unicidade e remover entradas vazias
	seen := make(map[string]struct{}, len(resp.Hits))
	sugestoes := make([]string, 0, len(resp.Hits))
	for _, hit := range resp.Hits {
		nome := strings.TrimSpace(hit[r.display])
		if nome == "" {
			continue
		}
		if _, ok := seen[nome]; ok {
			continue
		}
		seen[nome] = struct{}{}
		sugestoes = append(sugestoes, nome)
	}
	return sugestoes, nil
}
