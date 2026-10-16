import { fireEvent, render, screen } from '@testing-library/react'
import type { ReadonlyURLSearchParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearchCursos } from '@/services/api/use-search-cursos'
import { SortingOptionsCursos } from './sorting-options-cursos'

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}))

vi.mock('@/services/api/use-search-cursos', () => ({
  useSearchCursos: vi.fn(),
}))

describe('SortingOptionsCursos', () => {
  const updateParams = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as unknown as ReadonlyURLSearchParams,
    )
    vi.mocked(useSearchCursos).mockReturnValue({
      updateParams,
    } as unknown as ReturnType<typeof useSearchCursos>)
  })

  it('atualiza o parâmetro sort ao pressionar uma opção', () => {
    render(<SortingOptionsCursos />)

    fireEvent.click(screen.getByRole('button', { name: 'A Z' }))

    expect(updateParams).toHaveBeenCalledWith({ sort: 'az' })
  })

  it('propaga o módulo para os botões', () => {
    render(<SortingOptionsCursos module="2" />)

    expect(screen.getByRole('button', { name: 'Maior Enade' })).toHaveAttribute(
      'data-module',
      '2',
    )
  })

  it('marca a opção ativa com aria-pressed', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('sort=az') as unknown as ReadonlyURLSearchParams,
    )

    render(<SortingOptionsCursos />)

    expect(screen.getByRole('button', { name: 'A Z' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Maior Enade' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
