package ingest

import (
	"api_estudante/internal/features/ies"
	"api_estudante/internal/ingest/textcase"
)

// ToDocument converte um registro de origem no documento indexado.
func ToDocument(src SourceRecord) ies.IES {
	return ies.IES{
		CoIES:                   src.CoIES,
		NoIES:                   textcase.Title(src.NoIES),
		SgIES:                   src.SgIES,
		CategoriaAdministrativa: src.CategoriaAdministrativa,
		OrganizacaoAcademica:    src.OrganizacaoAcademica,
		Municipio:               src.Municipio,
		UF:                      src.UF,
		Regiao:                  src.Regiao,
	}
}
