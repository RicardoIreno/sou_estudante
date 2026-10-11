import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LayoutSite } from '.'

const meta = {
  title: 'Components/Layout/LayoutSite',
  component: LayoutSite,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LayoutSite>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <h1 className="font-display text-4xl font-semibold text-fg">
          Conteúdo da página
        </h1>
        <p className="mt-2 text-base text-fg-muted">
          O shell global renderiza o header e o footer ao redor deste conteúdo.
        </p>
      </div>
    ),
  },
}
