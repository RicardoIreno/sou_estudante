import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProfileIES } from './profile-ies'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}))

const ies = {
  co_ies: '376',
  no_ies: 'UNIVERSIDADE FEDERAL DE MATO GROSSO',
  sg_ies: 'UFMT',
  categoria_administrativa: { no_categoria_administrativa: 'Pública Federal' },
  organizacao_academica: { no_organizacao_academica: 'Universidade' },
  localizacao: {
    no_municipio: 'Cuiabá',
    sg_uf: 'MT',
    no_regiao: 'Centro-Oeste',
    in_capital: true,
  },
}

describe('ProfileIES', () => {
  it('renders the institution name, location and attributes', () => {
    render(<ProfileIES ies={ies} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'UFMT' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('UNIVERSIDADE FEDERAL DE MATO GROSSO'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Universidade · Pública Federal'),
    ).toBeInTheDocument()
    expect(screen.getByText('Pública Federal')).toBeInTheDocument()
    expect(screen.getByText('Região Centro-Oeste')).toBeInTheDocument()
    expect(screen.getByText('Cuiabá')).toBeInTheDocument()
    expect(screen.getByText('MT')).toBeInTheDocument()
  })
})
