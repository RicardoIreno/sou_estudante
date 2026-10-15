import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  CompareProvider,
  useCompareCursos,
} from '@/components/compare/compare-provider'
import { Header } from './header'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}))

function renderHeader(ui: ReactElement) {
  return render(<CompareProvider>{ui}</CompareProvider>)
}

function Seed({ ids }: { ids: string[] }) {
  const { toggle } = useCompareCursos()
  return (
    <button
      type="button"
      onClick={() => {
        for (const id of ids) toggle(id)
      }}
    >
      seed
    </button>
  )
}

function renderHeaderWithIds(ids: string[]) {
  return render(
    <CompareProvider>
      <Seed ids={ids} />
      <Header variant="inner" module="1" />
    </CompareProvider>,
  )
}

describe('Header', () => {
  it('links the application logo to the home page', () => {
    renderHeader(<Header />)

    const homeLink = screen.getByRole('link', {
      name: /SoU_Estudante/,
    })

    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('links to SoU_Ciência', () => {
    renderHeader(<Header />)

    const cienciaLink = screen.getByRole('link', {
      name: 'SoU_Ciência',
    })

    expect(cienciaLink).toHaveAttribute('href', 'https://souciencia.unifesp.br')
  })

  it('opens SoU_Ciência in a new tab', () => {
    renderHeader(<Header />)

    const cienciaLink = screen.getByRole('link', {
      name: 'SoU_Ciência',
    })

    expect(cienciaLink).toHaveAttribute('target', '_blank')
    expect(cienciaLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the menu', () => {
    renderHeader(<Header />)

    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
  })

  describe('inner variant', () => {
    it('renders a back link to home', () => {
      renderHeader(<Header variant="inner" />)

      expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
    })

    it('renders the current module pill with its route', () => {
      renderHeader(<Header variant="inner" module="1" />)

      expect(
        screen.getAllByRole('link', { name: 'Escolher curso' })[0],
      ).toHaveAttribute('href', '/cursos')
    })

    it('renders a comparison pill linking to /comparar when courses are selected', () => {
      renderHeaderWithIds(['101', '102'])

      fireEvent.click(screen.getByRole('button', { name: 'seed' }))

      const pill = screen.getByRole('link', { name: 'Comparar (2)' })
      expect(pill).toHaveAttribute('href', '/comparar')
    })

    it('renders a clear button that resets the selection', () => {
      renderHeaderWithIds(['101', '102'])

      fireEvent.click(screen.getByRole('button', { name: 'seed' }))

      fireEvent.click(screen.getByRole('button', { name: 'Limpar comparação' }))

      expect(
        screen.queryByRole('link', { name: 'Comparar (2)' }),
      ).not.toBeInTheDocument()
      expect(
        screen.getAllByRole('link', { name: 'Escolher curso' })[0],
      ).toHaveAttribute('href', '/cursos')
    })

    it('keeps the module pill when no courses are selected', () => {
      renderHeaderWithIds([])

      expect(
        screen.getAllByRole('link', { name: 'Escolher curso' })[0],
      ).toHaveAttribute('href', '/cursos')
    })

    it('does not render the SoU_Ciência link', () => {
      renderHeader(<Header variant="inner" module="1" />)

      expect(
        screen.queryByRole('link', { name: 'SoU_Ciência' }),
      ).not.toBeInTheDocument()
    })
  })
})
