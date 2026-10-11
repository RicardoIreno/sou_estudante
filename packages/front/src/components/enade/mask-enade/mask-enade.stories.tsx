import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MaskEnade } from './mask-enade'

const meta = {
  title: 'Components/Enade/MaskEnade',
  component: MaskEnade,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative h-40 w-[560px] overflow-hidden rounded-card border border-card-border bg-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MaskEnade>

export default meta

type Story = StoryObj<typeof meta>

export const Faixa5: Story = {
  args: { level: 5 },
}

export const Faixa4: Story = {
  args: { level: 4 },
}

export const Faixa3: Story = {
  args: { level: 3 },
}

export const Faixa2: Story = {
  args: { level: 2 },
}

export const Faixa1: Story = {
  args: { level: 1 },
}

export const SemConceito: Story = {
  args: { level: 'SC' },
}

export const SemAvaliacao: Story = {
  args: { level: null },
}
