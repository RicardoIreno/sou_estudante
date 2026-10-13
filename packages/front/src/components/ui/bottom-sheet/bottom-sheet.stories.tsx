import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BottomSheet } from './bottom-sheet'

const meta = {
  title: 'Components/Ui/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
} satisfies Meta<typeof BottomSheet>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: {
    open: true,
    onClose: () => {},
    labelledBy: 'sheet-title',
    children: (
      <div className="flex flex-col gap-4 p-6 font-sans text-fg">
        <h2 id="sheet-title" className="font-display text-lg font-bold">
          Filtros
        </h2>
        <p className="text-fg-muted">
          Conteúdo do bottom sheet: opções de filtro, ordenação etc.
        </p>
      </div>
    ),
  },
}
