import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SearchAutocomplete } from './search-autocomplete'

const useSugestoesFake = (termo: string) => ({
  sugestoes: termo
    ? ['MEDICINA', 'MEDICINA VETERINÁRIA'].filter((s) =>
        s.toLowerCase().includes(termo.toLowerCase()),
      )
    : [],
  isLoading: false,
})

const meta = {
  title: 'Components/Search/SearchAutocomplete',
  component: SearchAutocomplete,
  tags: ['autodocs'],
  args: {
    defaultValue: '',
    onSearchSubmit: () => {},
    useSuggestions: useSugestoesFake,
    placeholder: 'Busque pelo nome do curso',
    searchLabel: 'Buscar curso pelo nome',
    listLabel: 'Sugestões de cursos',
  },
} satisfies Meta<typeof SearchAutocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ComTermoInicial: Story = {
  args: {
    defaultValue: 'medicina',
  },
}
