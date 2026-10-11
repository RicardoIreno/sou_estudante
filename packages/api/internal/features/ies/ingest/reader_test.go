package ingest

import (
	"errors"
	"io"
	"path/filepath"
	"testing"

	"api_estudante/internal/testutil"
)

func TestReaderSkipsBulkMetadataAndReturnsSources(t *testing.T) {
	content := `{"index": {"_index": "ies", "_id": "376"}}
{"co_ies": "376", "no_ies": "ANHANGUERA", "uf": "SP"}
{"index": {"_index": "ies", "_id": "383"}}
{"co_ies": "383", "no_ies": "UNAMA", "uf": "PA"}
`
	reader, err := Open(testutil.WriteTempFile(t, "ies.ndjson", content))
	if err != nil {
		t.Fatalf("abrir origem: %v", err)
	}
	defer reader.Close()

	first, err := reader.Next()
	if err != nil {
		t.Fatalf("ler primeiro registro: %v", err)
	}
	if first.CoIES != "376" {
		t.Errorf("primeiro co_ies = %q, esperado %q", first.CoIES, "376")
	}

	second, err := reader.Next()
	if err != nil {
		t.Fatalf("ler segundo registro: %v", err)
	}
	if second.CoIES != "383" {
		t.Errorf("segundo co_ies = %q, esperado %q", second.CoIES, "383")
	}

	if _, err := reader.Next(); !errors.Is(err, io.EOF) {
		t.Fatalf("esperado EOF após o último registro, obtido %v", err)
	}
}

func TestReaderReturnsEOFForEmptyFile(t *testing.T) {
	reader, err := Open(testutil.WriteTempFile(t, "ies.ndjson", ""))
	if err != nil {
		t.Fatalf("abrir origem: %v", err)
	}
	defer reader.Close()

	if _, err := reader.Next(); !errors.Is(err, io.EOF) {
		t.Fatalf("esperado EOF para arquivo vazio, obtido %v", err)
	}
}

func TestReaderIgnoraOutrasAcoesDeBulk(t *testing.T) {
	content := `{"create": {"_index": "ies", "_id": "1"}}
{"delete": {"_index": "ies", "_id": "2"}}
{"update": {"_index": "ies", "_id": "3"}}
{"co_ies": "3", "no_ies": "UNAMA", "uf": "PA"}
`
	reader, err := Open(testutil.WriteTempFile(t, "ies.ndjson", content))
	if err != nil {
		t.Fatalf("abrir origem: %v", err)
	}
	defer reader.Close()

	record, err := reader.Next()
	if err != nil {
		t.Fatalf("ler registro: %v", err)
	}
	if record.CoIES != "3" {
		t.Errorf("co_ies = %q, esperado 3 (apenas a ação index revela o source)", record.CoIES)
	}

	if _, err := reader.Next(); !errors.Is(err, io.EOF) {
		t.Fatalf("esperado EOF, obtido %v", err)
	}
}

func TestIsMetadataNaoConfundeDocumentoDeOrigem(t *testing.T) {
	casos := []struct {
		nome string
		raw  string
		want bool
	}{
		{"ação index", `{"index":{"_index":"ies"}}`, true},
		{"ação create", `{"create":{"_index":"ies"}}`, true},
		{"ação desconhecida", `{"foo":{"_index":"ies"}}`, false},
		{"documento com chave index e outros campos", `{"co_ies":"1","index":"x"}`, false},
		{"json inválido", `{nao-e-json`, false},
	}

	for _, caso := range casos {
		t.Run(caso.nome, func(t *testing.T) {
			if got := isMetadata([]byte(caso.raw)); got != caso.want {
				t.Errorf("isMetadata(%s) = %v, esperado %v", caso.raw, got, caso.want)
			}
		})
	}
}

func TestOpenRetornaErroParaArquivoInexistente(t *testing.T) {
	if _, err := Open(filepath.Join(t.TempDir(), "inexistente.ndjson")); err == nil {
		t.Fatal("esperado erro ao abrir arquivo inexistente")
	}
}

func TestReaderRetornaErroParaJsonInvalido(t *testing.T) {
	reader, err := Open(testutil.WriteTempFile(t, "ies.ndjson", "{nao-e-json"))
	if err != nil {
		t.Fatalf("abrir origem: %v", err)
	}
	defer reader.Close()

	if _, err := reader.Next(); err == nil {
		t.Fatal("esperado erro para JSON inválido")
	}
}

func TestReaderArquivoTruncadoNaoRepeteErroIndefinidamente(t *testing.T) {
	path := testutil.WriteTempFile(t, "ies.ndjson", "{\"index\":{}}\n{\"co_ies\":\"1\",\"no_ies\":\"A\"}\n{\"index\":{}}\n{\"co_ies\":\"2\",\"no_i")
	reader, err := Open(path)
	if err != nil {
		t.Fatalf("abrir origem: %v", err)
	}
	defer reader.Close()

	if _, err := reader.Next(); err != nil {
		t.Fatalf("primeiro registro deveria ser lido: %v", err)
	}

	// O erro do arquivo truncado precisa ser estável e nunca virar EOF
	// (sucesso silencioso): o chamador decide abortar.
	for i := 0; i < 3; i++ {
		_, err := reader.Next()
		if err == nil || errors.Is(err, io.EOF) {
			t.Fatalf("chamada %d: esperado erro de truncamento, obtido %v", i, err)
		}
	}
}
