import { describe, expect, it } from 'vitest'
import type { Curso } from '@/services/api/types'
import { buildCompareSections } from './compare-rows'

const buildCurso = (overrides: Partial<Curso> = {}): Curso => ({
  sequencial: 101,
  instituicao: { no_ies: 'UFMG', sg_ies: 'UFMG' },
  curso: {
    no_curso: 'Ciência da Computação',
    no_grau_academico: 'Bacharelado',
    no_modalidade_ensino: 'Presencial',
    in_gratuito: true,
    cine: {},
  },
  localizacao: {
    no_municipio: 'Belo Horizonte',
    sg_uf: 'MG',
    in_capital: true,
  },
  censo_metricas: { qt_vg_total: 120, qt_mat: 480 },
  enade: { conceito_faixa_enade: '4', ano_enade: 2023 },
  tda: { tda: 51.2, nu_ano_referencia_tda: 2024 },
  sisu: {
    tem_sisu: true,
    ofertas: [{ nota_corte: 700.5, vagas: 40, turno: 'Integral' }],
  },
  ...overrides,
})

describe('buildCompareSections', () => {
  it('deriva um valor por coluna para cada linha', () => {
    const sections = buildCompareSections([buildCurso(), buildCurso()])

    const identidade = sections[0]
    const instituicao = identidade.rows.find(
      (row) => row.label === 'Instituição',
    )

    expect(instituicao?.values).toEqual(['UFMG', 'UFMG'])
  })

  it('formata o conceito Enade, a taxa de desistência e a gratuidade', () => {
    const sections = buildCompareSections([buildCurso()])

    const labels: Record<string, string | undefined> = {}
    for (const section of sections) {
      for (const row of section.rows) {
        labels[row.label] = row.values[0]
      }
    }

    expect(labels['Conceito Enade']).toBe('Nota 4')
    expect(labels['Taxa de desistência']).toBe('51%')
    expect(labels.Gratuidade).toBe('Gratuito')
    expect(labels['Oferta no Sisu']).toBe('Sim')
  })

  it('marca "SC" como sem conceito', () => {
    const sections = buildCompareSections([
      buildCurso({ enade: { conceito_faixa_enade: 'SC' } }),
    ])

    const qualidade = sections.find((section) => section.title === 'Qualidade')
    const conceito = qualidade?.rows.find(
      (row) => row.label === 'Conceito Enade',
    )

    expect(conceito?.values[0]).toBe('Sem conceito')
  })

  it('vira célula indefinida para curso não encontrado', () => {
    const sections = buildCompareSections([null])

    const identidade = sections[0]
    const instituicao = identidade.rows.find(
      (row) => row.label === 'Instituição',
    )

    expect(instituicao?.values[0]).toBeUndefined()
  })
})
