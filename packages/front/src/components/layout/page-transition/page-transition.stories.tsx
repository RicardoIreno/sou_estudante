import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PageTransition } from './page-transition'

const meta = {
  title: 'Components/Layout/PageTransition',
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
      <div className="p-10 font-sans text-base text-fg">
        O conteúdo surge com um fade e uma leve subida ao entrar nesta página.
      </div>
    ),
  },
}
