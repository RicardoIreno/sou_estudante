import type { Curso } from '@/services/api/types'

export interface CompareRow {
  label: string
  values: (string | undefined)[]
}

export interface CompareSection {
  title: string
  source: string
  rows: CompareRow[]
}

const capitalize = (value?: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ''

function enadeLabel(raw?: string): string | undefined {
  if (!raw) return undefined
  const normalized = raw.trim()
  if (/^[1-5]$/.test(normalized)) return `Nota ${normalized}`
  if (normalized.toUpperCase() === 'SC') return 'Sem conceito'
  return 'Sem avaliação'
}

/**
 * Deriva as seções/linhas da matriz de comparação a partir dos cursos
 * selecionados. Cada linha tem um valor por coluna (na ordem dos cursos);
 * colunas sem dado viram `undefined` (renderizadas como "—" pela matriz).
 */
export function buildCompareSections(
  cursos: (Curso | null)[],
): CompareSection[] {
  const column = (read: (curso: Curso) => string | undefined) =>
    cursos.map((curso) => (curso ? read(curso) : undefined))

  return [
    {
      title: 'Identidade',
      source: 'Censo da Educação Superior',
      rows: [
        { label: 'Instituição', values: column((c) => c.instituicao?.no_ies) },
        { label: 'UF', values: column((c) => c.localizacao?.sg_uf) },
        {
          label: 'Município',
          values: column((c) => c.localizacao?.no_municipio),
        },
        {
          label: 'Grau acadêmico',
          values: column((c) => c.curso?.no_grau_academico),
        },
        {
          label: 'Modalidade',
          values: column((c) => capitalize(c.curso?.no_modalidade_ensino)),
        },
        {
          label: 'Gratuidade',
          values: column((c) =>
            c.curso?.in_gratuito === undefined
              ? undefined
              : c.curso.in_gratuito
                ? 'Gratuito'
                : 'Pago',
          ),
        },
        {
          label: 'Vagas por ano',
          values: column((c) =>
            c.censo_metricas?.qt_vg_total !== undefined
              ? String(c.censo_metricas.qt_vg_total)
              : undefined,
          ),
        },
        {
          label: 'Matrículas',
          values: column((c) =>
            c.censo_metricas?.qt_mat !== undefined
              ? String(c.censo_metricas.qt_mat)
              : undefined,
          ),
        },
      ],
    },
    {
      title: 'Qualidade',
      source: 'Enade',
      rows: [
        {
          label: 'Conceito Enade',
          values: column((c) => enadeLabel(c.enade?.conceito_faixa_enade)),
        },
        {
          label: 'Ano do Enade',
          values: column((c) =>
            c.enade?.ano_enade !== undefined
              ? String(c.enade.ano_enade)
              : undefined,
          ),
        },
      ],
    },
    {
      title: 'Permanência',
      source: 'Taxa de Desistência Acumulada (TDA)',
      rows: [
        {
          label: 'Taxa de desistência',
          values: column((c) =>
            c.tda?.tda !== undefined ? `${Math.round(c.tda.tda)}%` : undefined,
          ),
        },
        {
          label: 'Ano de referência',
          values: column((c) =>
            c.tda?.nu_ano_referencia_tda !== undefined
              ? String(c.tda.nu_ano_referencia_tda)
              : undefined,
          ),
        },
      ],
    },
    {
      title: 'Ingresso via Sisu',
      source: 'Sisu',
      rows: [
        {
          label: 'Oferta no Sisu',
          values: column((c) => (c.sisu?.tem_sisu ? 'Sim' : 'Não')),
        },
        {
          label: 'Nota de corte',
          values: column((c) => {
            const nota = c.sisu?.ofertas?.[0]?.nota_corte
            return nota !== undefined ? String(nota) : undefined
          }),
        },
        {
          label: 'Vagas no Sisu',
          values: column((c) => {
            const vagas = c.sisu?.ofertas?.[0]?.vagas
            return vagas !== undefined ? String(vagas) : undefined
          }),
        },
        {
          label: 'Turno',
          values: column((c) => capitalize(c.sisu?.ofertas?.[0]?.turno)),
        },
      ],
    },
  ]
}
