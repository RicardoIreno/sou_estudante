import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Menu } from './menu'

describe('Menu', () => {
  it('starts with the menu closed', () => {
    render(<Menu />)

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('opens the menu when the menu button is clicked', async () => {
    const user = userEvent.setup()

    render(<Menu />)

    await user.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeVisible()
  })

  it('moves focus to the close button when opened', async () => {
    const user = userEvent.setup()

    render(<Menu />)

    await user.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus()
  })

  it('closes the menu when the close button is clicked', async () => {
    const user = userEvent.setup()

    render(<Menu />)

    await user.click(screen.getByRole('button', { name: 'Menu' }))
    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus()
  })

  it('closes the menu when Escape is pressed', async () => {
    const user = userEvent.setup()

    render(<Menu />)

    await user.click(screen.getByRole('button', { name: 'Menu' }))
    await user.keyboard('{Escape}')

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus()
  })

  it('renders the navigation links', () => {
    render(<Menu />)

    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute(
      'href',
      '/',
    )

    expect(screen.getByRole('link', { name: 'Metodologia' })).toHaveAttribute(
      'href',
      '/metodologia',
    )

    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute(
      'href',
      '/sobre',
    )

    expect(
      screen.getByRole('link', { name: 'Escolher curso' }),
    ).toHaveAttribute('href', '/cursos')

    expect(
      screen.getByRole('link', { name: 'Como ingressar' }),
    ).toHaveAttribute('href', '/ingresso')

    expect(
      screen.getByRole('link', { name: 'Como permanecer' }),
    ).toHaveAttribute('href', '/permanencia')

    expect(
      screen.getByRole('link', { name: 'Conhecer instituição' }),
    ).toHaveAttribute('href', '/ies')

    expect(
      screen.getByRole('link', { name: 'Comparar cursos' }),
    ).toHaveAttribute('href', '/comparar')
  })

  it('closes the menu when a navigation link is clicked', async () => {
    const user = userEvent.setup()

    render(<Menu />)

    await user.click(screen.getByRole('button', { name: 'Menu' }))
    await user.click(screen.getByRole('link', { name: 'Escolher curso' }))

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus()
  })

  it('supports light mode', () => {
    render(<Menu mode="light" />)

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveClass(
      'bg-fg',
      'text-on-dark',
    )
  })

  it('uses the module accent surface when a module is provided', () => {
    render(<Menu mode="light" module="2" />)

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveClass(
      'border-accent-deep/50',
      'bg-accent',
      'text-accent-fg',
    )
  })

  it('supports dark mode', () => {
    render(<Menu mode="dark" />)

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveClass(
      'bg-on-dark/10',
      'text-on-dark',
    )
  })
})
