import type { Meta, StoryObj } from '@storybook/react'
import { PageTransition } from './page-transition'

const meta = {
  title: 'Components/Layouts/PageTransition',
  component: PageTransition,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageTransition>

export default meta

type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  args: {
    children: (
      <div className="p-10 font-protagonist text-protagonist text-fg-protagonist">
        O conteúdo surge com um fade e uma leve subida ao entrar nesta página.
      </div>
    ),
  },
}
