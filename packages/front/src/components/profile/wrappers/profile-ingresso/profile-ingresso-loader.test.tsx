import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Curso } from '@/services/api/types'
import { useCurso } from '@/services/api/use-curso'
import { ProfileIngressoLoader } from './profile-ingresso-loader'

vi.mock('@/services/api/use-curso', () => ({
  useCurso: vi.fn(),
}))

vi.mock('./profile-ingresso', () => ({
  ProfileIngresso: () => <div>detalhe do ingresso</div>,
}))

describe('ProfileIngressoLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockCurso = (override: Partial<ReturnType<typeof useCurso>>) => {
    vi.mocked(useCurso).mockReturnValue({
      curso: null,
      isLoading: false,
      error: null,
      notFound: false,
      ...override,
    })
  }

  it('renderiza o detalhe quando o curso tem Sisu', () => {
    mockCurso({
      curso: {
        sequencial: 1,
        sisu: { tem_sisu: true, ofertas: [] },
      } as unknown as Curso,
    })

    render(<ProfileIngressoLoader id="1" />)

    expect(screen.getByText('detalhe do ingresso')).toBeInTheDocument()
  })

  it('mostra o indicador de carregamento enquanto busca o curso', () => {
    mockCurso({ isLoading: true })

    render(<ProfileIngressoLoader id="1" />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('avisa quando a oferta não foi encontrada e oferece voltar à busca', () => {
    mockCurso({ notFound: true })

    render(<ProfileIngressoLoader id="999" />)

    expect(screen.getByText('Oferta não encontrada')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar à busca' }),
    ).toHaveAttribute('href', '/cursos')
  })

  it('mostra a mensagem de erro quando a busca falha', () => {
    mockCurso({ error: 'Erro de conexão com a API.' })

    render(<ProfileIngressoLoader id="1" />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Erro de conexão com a API.',
    )
  })

  it('avisa quando o curso não tem ingresso por Sisu', () => {
    mockCurso({
      curso: {
        sequencial: 1,
        instituicao: { no_ies: 'Universidade Federal' },
        sisu: { tem_sisu: false, ofertas: [] },
      } as unknown as Curso,
    })

    render(<ProfileIngressoLoader id="1" />)

    expect(
      screen.getByText('O curso não possui ingresso por Sisu'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/consulte o site da instituição/),
    ).toBeInTheDocument()
    expect(screen.getByText('Universidade Federal')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar à busca' }),
    ).toHaveAttribute('href', '/cursos')
  })
})
