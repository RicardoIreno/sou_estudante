import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from './index'

describe('Card', () => {
  it('renders its content', () => {
    render(<Card>Conteúdo</Card>)
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('exposes the module theme through data-module', () => {
    render(<Card module="2">Conteúdo</Card>)
    expect(screen.getByText('Conteúdo')).toHaveAttribute('data-module', '2')
  })

  it('lets its tags inherit the module theme from the card', () => {
    render(
      <Card module="3">
        <Card.Tags source={['Gratuito']} />
      </Card>,
    )
    expect(
      screen.getByText('Gratuito').closest('[data-module]'),
    ).toHaveAttribute('data-module', '3')
  })

  it('renders rich tags with icon and source', () => {
    render(
      <Card module="2">
        <Card.Tags
          source={[
            { label: 'Tubarão, SC', source: 'Censo' },
            { label: '19 vagas', source: 'Censo', tone: 'neutral' },
          ]}
        />
      </Card>,
    )
    expect(screen.getByText('Tubarão, SC')).toBeInTheDocument()
    expect(screen.getByText('19 vagas')).toBeInTheDocument()
    expect(screen.getAllByText(/Censo/)).toHaveLength(2)
  })

  it('renders a custom node among tags', () => {
    render(
      <Card module="2">
        <Card.Tags
          source={['Gratuito', <span key="enade">Nota 4 no Enade</span>]}
        />
      </Card>,
    )
    expect(screen.getByText('Gratuito')).toBeInTheDocument()
    expect(screen.getByText('Nota 4 no Enade')).toBeInTheDocument()
  })

  it('renders the header title and subtitle', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title title="Direito" subtitle="USP" />
        </Card.Header>
      </Card>,
    )
    expect(screen.getByText('Direito')).toBeInTheDocument()
    expect(screen.getByText('USP')).toBeInTheDocument()
  })

  it('renders a decorative backdrop behind the content', () => {
    const { container } = render(
      <Card>
        <Card.Backdrop>
          <span>fundo</span>
        </Card.Backdrop>
        <span>conteúdo</span>
      </Card>,
    )

    const backdrop = container.querySelector('[aria-hidden="true"]')
    expect(backdrop).toBeInTheDocument()
    expect(backdrop).toContainElement(screen.getByText('fundo'))
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('renders the progress bar title and percentage', () => {
    render(
      <Card>
        <Card.ProgressBar title="Nota de corte" percentage="50%" />
      </Card>,
    )
    expect(screen.getByText('Nota de corte')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('renders the progress bar no-data state with empty bar and hint', () => {
    const { container } = render(
      <Card>
        <Card.ProgressBar
          title="Taxa de desistência acumulada (5 anos)"
          emptyHint="sem dados"
        />
      </Card>,
    )
    expect(
      screen.getByText('Taxa de desistência acumulada (5 anos) • sem dados'),
    ).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(container.querySelector('.bg-progress-bar-foreground')).toHaveStyle({
      width: '0%',
    })
  })
})
