import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ShellHeader } from './shell-header'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({ back: vi.fn(), push: vi.fn() })),
}))

const renderAt = (pathname: string) => {
  vi.mocked(usePathname).mockReturnValue(pathname)
  return render(<ShellHeader />)
}

describe('ShellHeader', () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReset()
  })

  it('shows the home header, without a back button, on the home page', () => {
    renderAt('/')

    expect(screen.getByRole('banner')).toHaveClass('max-w-home')
    expect(
      screen.queryByRole('button', { name: /voltar/i }),
    ).not.toBeInTheDocument()
  })

  it.each([
    '/cursos',
    '/ies',
    '/ingresso',
    '/comparar',
    '/permanencia',
  ])('shows the inner header with a back button on %s', (pathname) => {
    renderAt(pathname)

    expect(screen.getByRole('banner')).toHaveClass('max-w-pages')
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument()
  })

  it('links the inner header to the module of the current route', () => {
    renderAt('/cursos')

    expect(
      screen
        .getAllByRole('link')
        .some((link) => link.getAttribute('href') === '/cursos'),
    ).toBe(true)
  })

  it.each([
    '/cursos/123',
    '/ies/456',
    '/ingresso/789',
  ])('renders header on the detail page %s', (pathname) => {
    renderAt(pathname)

    expect(screen.getByRole('banner')).toHaveClass('max-w-2xl')
  })
})
