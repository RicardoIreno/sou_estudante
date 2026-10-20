// Package domain reúne vocabulário de domínio compartilhado entre features.
package domain

import "strings"

// CategoriaTerms traduz o rótulo de categoria exibido na UI para os valores de
// categoria_administrativa indexados a partir dos dados da IES. Os valores
// refletem a normalização textcase.Title aplicada na ingestão.
func CategoriaTerms(categoria string) []string {
	switch strings.ToLower(categoria) {
	case "privada":
		return []string{"Privada Com Fins Lucrativos", "Privada Sem Fins Lucrativos"}
	case "federal":
		return []string{"Pública Federal"}
	case "estadual":
		return []string{"Pública Estadual"}
	case "municipal":
		return []string{"Pública Municipal"}
	default:
		return nil
	}
}
