import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearchCursos } from '@/services/api/use-search-cursos'
import SearchResultSectionCursos from './search-result-section-cursos'

vi.mock('@/services/api/use-search-cursos', () => ({
  useSearchCursos: vi.fn(),
}))

const buildSearchResult = (
  tda: { tda?: number },
  enade: { conceito_faixa_enade?: string } = {},
) => ({
  query: 'computação',
  results: [
    {
      sequencial: 101,
      instituicao: { co_ies: '123' },
      curso: {
        no_curso: 'Ciência da Computação',
        in_gratuito: true,
        cine: {},
      },
      localizacao: { in_capital: true },
      censo_metricas: {},
      enade,
      tda,
      sisu: { tem_sisu: false, ofertas: [] },
    },
  ],
  isLoading: false,
  error: null,
  total: 1,
  currentPage: 1,
  limit: 20,
  links: null,
  setQuery: vi.fn(),
  navigateToPage: vi.fn(),
  updateParams: vi.fn(),
  resetFilters: vi.fn(),
  aggregations: null,
})

describe('SearchResultSectionCursos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza os resultados obtidos diretamente do hook useSearchCursos sem prop drilling', () => {
    vi.mocked(useSearchCursos).mockReturnValue({
      query: 'computação',
      results: [
        {
          sequencial: 101,
          instituicao: { co_ies: '123' },
          curso: {
            no_curso: 'Ciência da Computação',
            in_gratuito: true,
            cine: {},
          },
          localizacao: { in_capital: true },
          censo_metricas: {},
          enade: {},
          tda: {},
          sisu: { tem_sisu: false, ofertas: [] },
        },
      ],
      isLoading: false,
      error: null,
      total: 1,
      currentPage: 1,
      limit: 20,
      links: null,
      setQuery: vi.fn(),
      navigateToPage: vi.fn(),
      updateParams: vi.fn(),
      resetFilters: vi.fn(),
      aggregations: null,
    })

    render(<SearchResultSectionCursos />)

    expect(screen.getByText(/Ciência da Computação/)).toBeInTheDocument()
    expect(screen.getByText('1 curso encontrado')).toBeInTheDocument()
  })

  it('exibe a contagem de gratuitos ao lado do total', () => {
    vi.mocked(useSearchCursos).mockReturnValue({
      query: 'computação',
      results: [
        {
          sequencial: 101,
          instituicao: { co_ies: '123' },
          curso: {
            no_curso: 'Ciência da Computação',
            in_gratuito: true,
            cine: {},
          },
          localizacao: { in_capital: true },
          censo_metricas: {},
          enade: {},
          tda: {},
          sisu: { tem_sisu: false, ofertas: [] },
        },
      ],
      isLoading: false,
      error: null,
      total: 30,
      currentPage: 1,
      limit: 20,
      links: null,
      setQuery: vi.fn(),
      navigateToPage: vi.fn(),
      updateParams: vi.fn(),
      resetFilters: vi.fn(),
      aggregations: { gratuitos: [{ key: 'Gratuito', count: 12 }] },
    })

    render(<SearchResultSectionCursos />)

    expect(screen.getByText('12 gratuitos')).toBeInTheDocument()
  })

  it('exibe estado de carregamento quando isLoading for true', () => {
    vi.mocked(useSearchCursos).mockReturnValue({
      query: 'computação',
      results: [],
      isLoading: true,
      error: null,
      total: 0,
      currentPage: 1,
      limit: 20,
      links: null,
      setQuery: vi.fn(),
      navigateToPage: vi.fn(),
      updateParams: vi.fn(),
      resetFilters: vi.fn(),
      aggregations: null,
    })

    const { container } = render(<SearchResultSectionCursos />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0,
    )
  })

  it('exibe a taxa de desistência e o selo Enade quando disponíveis', () => {
    vi.mocked(useSearchCursos).mockReturnValue(
      buildSearchResult({ tda: 51 }, { conceito_faixa_enade: '4' }),
    )

    render(<SearchResultSectionCursos />)

    expect(screen.getByText('51%')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Conceito Enade 4 de 5' }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/sem dados/)).not.toBeInTheDocument()
  })

  it('exibe o selo "SC" quando o curso não tem conceito', () => {
    vi.mocked(useSearchCursos).mockReturnValue(
      buildSearchResult({}, { conceito_faixa_enade: 'SC' }),
    )

    render(<SearchResultSectionCursos />)

    expect(
      screen.getByRole('img', { name: 'Sem conceito (SC)' }),
    ).toBeInTheDocument()
    expect(screen.getByText('SC')).toBeInTheDocument()
  })

  it('exibe o selo sem avaliação quando não há conceito nem taxa', () => {
    vi.mocked(useSearchCursos).mockReturnValue(buildSearchResult({}))

    const { container } = render(<SearchResultSectionCursos />)

    expect(
      screen.getByText('Taxa de desistência acumulada (5 anos) • sem dados'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Sem avaliação no ciclo' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2)
    expect(container.querySelector('[data-mask="enade"]')).toBeInTheDocument()
  })
})
