package dictionary

import (
	"context"
	"fmt"
	"io"

	"github.com/elastic/go-elasticsearch/v8"

	"api_estudante/internal/config"
	"api_estudante/internal/ingest/bulk"
)

// Spec descreve como construir um índice de dicionário a partir de um campo
// termo do índice de origem.
type Spec struct {
	SourceIndex string
	TargetIndex string
	SourceField string
	DocField    string
	Mapping     []byte
}

// Build constrói o índice de dicionário a partir dos termos únicos do índice
// de origem, por troca atômica: indexa num índice novo (<TargetIndex>-latest) e
// aponta o alias TargetIndex para ele ao final. Retorna a quantidade de termos
// inseridos.
func Build(ctx context.Context, client *elasticsearch.Client, cfg *config.Config, spec Spec) (int, error) {
	terms, err := uniqueTerms(ctx, client, spec.SourceIndex, spec.SourceField)
	if err != nil {
		return 0, err
	}

	stream := &termStream{field: spec.DocField, terms: terms}
	return BuildStream(ctx, client, cfg, spec.TargetIndex, spec.Mapping, stream)
}

// BuildStream constrói o índice de dicionário a partir de um stream de
// documentos já prontos, por troca atômica. Retorna a quantidade de documentos
// inseridos.
func BuildStream(ctx context.Context, client *elasticsearch.Client, cfg *config.Config, targetIndex string, mapping []byte, stream bulk.Stream) (int, error) {
	concrete := targetIndex + "-latest"

	// Remove um "-latest" de uma execução anterior que falhou no meio.
	if err := bulk.Delete(ctx, client, concrete); err != nil {
		return 0, err
	}
	if err := bulk.Create(ctx, client, concrete, mapping); err != nil {
		return 0, err
	}

	inserted, err := bulk.Run(ctx, client, concrete, cfg, stream)
	if err != nil {
		return 0, fmt.Errorf("indexar termos do dicionário: %w", err)
	}
	if err := bulk.Refresh(ctx, client, concrete); err != nil {
		return 0, err
	}

	previous, err := bulk.AliasIndices(ctx, client, targetIndex)
	if err != nil {
		return 0, err
	}
	if err := bulk.PointAlias(ctx, client, targetIndex, concrete, previous); err != nil {
		return 0, err
	}
	for _, old := range previous {
		if old != concrete {
			if err := bulk.Delete(ctx, client, old); err != nil {
				return 0, err
			}
		}
	}

	return int(inserted), nil
}

// termStream gera um documento de dicionário por termo único, no formato
// aceito pelo motor de ingestão.
type termStream struct {
	field string
	terms []string
	next  int
}

// Next retorna o próximo termo como documento pronto para indexação.
func (s *termStream) Next() (*bulk.Document, error) {
	if s.next >= len(s.terms) {
		return nil, io.EOF
	}
	term := s.terms[s.next]
	s.next++
	return &bulk.Document{Body: map[string]string{s.field: term}}, nil
}

// Close satisfaz bulk.Stream; não há recurso a liberar.
func (s *termStream) Close() error { return nil }
