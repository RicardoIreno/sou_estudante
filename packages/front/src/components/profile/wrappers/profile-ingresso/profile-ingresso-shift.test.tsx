import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Oferta } from '@/services/api'
import { ProfileIngressoShift } from './profile-ingresso-shift'

const ampla: Oferta = {
  modalidade: 'AC',
  turno: 'NOTURNO',
  vagas: 40,
  nota_corte: 650.5,
}

const cota: Oferta = {
  modalidade: 'L1',
  turno: 'NOTURNO',
  descricao: 'Escola pública, baixa renda',
  vagas: 5,
  nota_corte: 600,
}

describe('ProfileIngressoShift', () => {
  it('renders nothing when there are no offers', () => {
    const { container } = render(<ProfileIngressoShift ofertas={[]} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('shows the broad-competition cut-off grade, seats and capitalized shift', () => {
    render(<ProfileIngressoShift ofertas={[ampla]} />)

    expect(screen.getByText(/650,50/)).toBeInTheDocument()
    expect(screen.getByText('40')).toBeInTheDocument()
    expect(screen.getByText('Noturno')).toBeInTheDocument()
  })

  it('shows placeholders when the broad-competition offer has no grade or seats', () => {
    render(
      <ProfileIngressoShift
        ofertas={[{ modalidade: 'AC', turno: 'MATUTINO' }]}
      />,
    )

    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('lists the quota offers after the broad-competition one', () => {
    render(<ProfileIngressoShift ofertas={[ampla, cota]} />)

    expect(screen.getByText('Modalidades de cota — Sisu')).toBeInTheDocument()
    expect(screen.getByText('L1')).toBeInTheDocument()
    expect(screen.getByText('Escola pública, baixa renda')).toBeInTheDocument()
  })

  it('omits the quota section when there are only broad-competition offers', () => {
    render(<ProfileIngressoShift ofertas={[ampla]} />)

    expect(
      screen.queryByText('Modalidades de cota — Sisu'),
    ).not.toBeInTheDocument()
  })
})
