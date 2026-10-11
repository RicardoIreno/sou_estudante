import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SearchHeader } from './index'

const autocompleteProps = {
  useSuggestions: () => ({ sugestoes: [], isLoading: false }),
  placeholder: 'Busque pelo nome',
  searchLabel: 'Buscar pelo nome',
  listLabel: 'Sugestões',
}

const meta = {
  title: 'Components/Search/SearchHeader',
  component: SearchHeader,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    module: '1',
    children: (
      <>
        <SearchHeader.Autocomplete
          {...autocompleteProps}
          onSearchSubmit={() => {}}
        />
        <SearchHeader.Actions>
          <span className="font-sans text-sm">Controles extras</span>
        </SearchHeader.Actions>
        <SearchHeader.Sorting>
          <span className="font-sans text-sm">Ordenação</span>
        </SearchHeader.Sorting>
      </>
    ),
  },
}
