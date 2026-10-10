import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Curso } from '@/services/api/types'
import SearchResultItem from './search-result-item'

const buildCurso = (temSisu: boolean): Curso => ({
  sequencial: 101,
  curso: {
    co_curso: '123',
    no_curso: 'Ciência da Computação',
    no_grau_academico: 'Bacharelado',
    in_gratuito: true,
    cine: {},
  },
  instituicao: { co_ies: '1', no_ies: 'UFMG', sg_ies: 'UFMG' },
  localizacao: {
    no_municipio: 'Belo Horizonte',
    sg_uf: 'MG',
    in_capital: true,
  },
  censo_metricas: {},
  enade: {},
  tda: {},
  sisu: { tem_sisu: temSisu, ofertas: [] },
})

describe('SearchResultItem', () => {
  it('links to the course profile', () => {
    render(<SearchResultItem curso={buildCurso(false)} />)

    expect(
      screen.getByRole('link', { name: /Ciência da Computação/ }),
    ).toHaveAttribute('href', '/cursos/101')
  })

  it('shows a link to the Sisu admission profile when the course has Sisu', () => {
    render(<SearchResultItem curso={buildCurso(true)} />)

    expect(
      screen.getByRole('link', { name: /Ver ingresso via Sisu/ }),
    ).toHaveAttribute('href', '/ingresso/101')
  })

  it('does not show the Sisu link when the course has no Sisu', () => {
    render(<SearchResultItem curso={buildCurso(false)} />)

    expect(
      screen.queryByRole('link', { name: /Ver ingresso via Sisu/ }),
    ).not.toBeInTheDocument()
  })
})
