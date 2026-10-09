export type EnadeLevel = 1 | 2 | 3 | 4 | 5 | 'SC' | null

/**
 * Normaliza o valor bruto de `conceito_faixa_enade` para o nível aceito pelo
 * SeloEnade. Retorna `null` para vazio, inválido ou "sem avaliação no ciclo".
 */
export const parseEnadeLevel = (raw?: string | number | null): EnadeLevel => {
  if (raw === undefined || raw === null || raw === '') return null
  const normalized = String(raw).trim()
  const numerica = Number.parseInt(normalized, 10)
  if (numerica >= 1 && numerica <= 5) {
    return numerica as 1 | 2 | 3 | 4 | 5
  }
  return normalized.toUpperCase() === 'SC' ? 'SC' : null
}
