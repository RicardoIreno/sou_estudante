import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TagEnade } from './tag-enade'

const meta = {
  title: 'Components/Enade/TagEnade',
  component: TagEnade,
  tags: ['autodocs'],
  args: {
    level: 5,
  },
} satisfies Meta<typeof TagEnade>

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
