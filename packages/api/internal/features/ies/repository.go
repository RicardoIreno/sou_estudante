package ies

import (
	"context"
	"encoding/json"
	"errors"

	es "github.com/elastic/go-elasticsearch/v8"

	"api_estudante/internal/elasticsearch"
)

// ErrNotFound indica que a IES solicitada não existe no índice.
var ErrNotFound = errors.New("ies não encontrada")

// Repository define o contrato de acesso às IES.
type Repository interface {
	Search(ctx context.Context, query string, filters SearchFilterParams, page, limit int) (*SearchResult, error)
	GetByID(ctx context.Context, coIES string) (*IES, error)
}

// ElasticsearchRepository implementa Repository usando Elasticsearch.
type ElasticsearchRepository struct {
	client *es.Client
	index  string
}

// SearchResult encapsula a resposta do Elasticsearch.
type SearchResult struct {
	Total        int
	Hits         []IES
	Aggregations *SearchAggregations
}

// NewElasticsearchRepository cria uma nova instância do repository sobre o
// índice de IES informado (config.IESIndexName).
func NewElasticsearchRepository(client *es.Client, index string) Repository {
	return &ElasticsearchRepository{
		client: client,
		index:  index,
	}
}

// buildTextQuery monta a busca textual por nome e sigla da IES. Usa operator
// "and" para exigir todos os termos digitados e evitar correspondências soltas.
func buildTextQuery(query string) map[string]any {
	return map[string]any{
		"multi_match": map[string]any{
			"query":     query,
			"fields":    []string{"no_ies^3", "sg_ies^2"},
			"type":      "best_fields",
			"operator":  "and",
			"fuzziness": "AUTO",
		},
	}
}

// categoriaField é o campo keyword da categoria administrativa no índice ies
// (já keyword, portanto sem sufixo ".keyword").
const categoriaField = "categoria_administrativa"

// categoriaFilter monta a cláusula de filtro por categoria administrativa.
func categoriaFilter(categoria string) map[string]any {
	return elasticsearch.CategoriaFilter(categoriaField, categoria)
}

// buildFilterClauses monta as cláusulas de filtro cumulativas.
func buildFilterClauses(filters SearchFilterParams) []map[string]any {
	clauses := []map[string]any{}

	if len(filters.UF) > 0 {
		clauses = append(clauses, elasticsearch.UpperTermsFilter("uf", filters.UF))
	}

	if len(filters.Regiao) > 0 {
		clauses = append(clauses, elasticsearch.TermsFilter("regiao", filters.Regiao))
	}

	if clause := elasticsearch.CategoriaAnyOf(categoriaField, filters.Categoria); clause != nil {
		clauses = append(clauses, clause)
	}

	if len(filters.Organizacao) > 0 {
		clauses = append(clauses, elasticsearch.TermsFilter("organizacao_academica", filters.Organizacao))
	}

	return clauses
}

// buildSortClauses define a ordenação: relevância (score) ou alfabética (padrão).
func buildSortClauses(sort string) []map[string]any {
	switch sort {
	case "relevancia", "_score":
		return []map[string]any{
			{"_score": "desc"},
		}
	default:
		return []map[string]any{
			{"no_ies.keyword": map[string]any{"order": "asc"}},
		}
	}
}

// buildAggregations monta as agregações usadas pelos filtros da UI.
func buildAggregations() map[string]any {
	return map[string]any{
		"ufs":          elasticsearch.TermsAgg("uf", 30),
		"regioes":      elasticsearch.TermsAgg("regiao", 10),
		"organizacoes": elasticsearch.TermsAgg("organizacao_academica", 20),
		"categorias":   elasticsearch.CategoriasAgg(categoriaField),
	}
}

// parseAggregations converte o bloco de agregações do ES em buckets.
func parseAggregations(raw map[string]json.RawMessage) *SearchAggregations {
	if len(raw) == 0 {
		return nil
	}

	return &SearchAggregations{
		UFs:          elasticsearch.ParseBuckets(raw, "ufs"),
		Regioes:      elasticsearch.ParseBuckets(raw, "regioes"),
		Categorias:   elasticsearch.ParseBuckets(raw, "categorias"),
		Organizacoes: elasticsearch.ParseBuckets(raw, "organizacoes"),
	}
}

// Search executa a busca de IES com filtros cumulativos, ordenação e agregações.
func (r *ElasticsearchRepository) Search(
	ctx context.Context,
	query string,
	filters SearchFilterParams,
	page, limit int,
) (*SearchResult, error) {
	esQuery := elasticsearch.SearchBody(
		buildTextQuery(query),
		buildFilterClauses(filters),
		buildSortClauses(filters.Sort),
		buildAggregations(),
		page, limit,
	)

	resp, err := elasticsearch.ExecuteSearch[IES](ctx, r.client, r.index, esQuery)
	if err != nil {
		return nil, err
	}

	return &SearchResult{
		Total:        resp.Total,
		Hits:         resp.Hits,
		Aggregations: parseAggregations(resp.Aggregations),
	}, nil
}

// GetByID busca uma IES pelo seu co_ies (que também é o _id do documento).
func (r *ElasticsearchRepository) GetByID(ctx context.Context, coIES string) (*IES, error) {
	return elasticsearch.GetByID[IES](ctx, r.client, r.index, coIES, "ies", ErrNotFound)
}
