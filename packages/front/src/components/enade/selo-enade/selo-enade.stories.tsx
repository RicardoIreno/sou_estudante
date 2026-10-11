import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SeloEnade } from './selo-enade'

const meta = {
  title: 'Components/Enade/SeloEnade',
  component: SeloEnade,
  tags: ['autodocs'],
  args: {
    level: 5,
    size: 'card',
  },
} satisfies Meta<typeof SeloEnade>

export default meta

type Story = StoryObj<typeof meta>

export const Level5: Story = {
  args: { level: 5 },
}

export const Level4: Story = {
  args: { level: 4 },
}

export const Level3: Story = {
  args: { level: 3 },
}

export const Level2: Story = {
  args: { level: 2 },
}

export const Level1: Story = {
  args: { level: 1 },
}

export const SemConceito: Story = {
  args: { level: 'SC' },
}

export const SemAvaliacaoNoCiclo: Story = {
  args: { level: null },
}

export const DetalheLevel5: Story = {
  args: { level: 5, size: 'detalhe' },
}

export const DetalheLevel2: Story = {
  args: { level: 2, size: 'detalhe' },
}

export const DetalheNeblina: Story = {
  args: { level: null, size: 'detalhe' },
}
