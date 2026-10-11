import { LayoutSearchPage } from '@/components/layout/layout-search-page'
import { ActiveFiltersIes } from '@/components/search/active-filters/wrappers/active-filters-ies/active-filters-ies'
import { FiltersPanelIes } from '@/components/search/filters-panel/wrappers/filters-panel-ies/filters-panel-ies'
import { SearchHeaderIes } from '@/components/search/search-header/wrappers/search-header-ies/search-header-ies'
import { SearchResultsIes } from '@/components/search/search-results/wrappers/search-results-ies/search-results-ies'
import { SortingOptionsIes } from '@/components/search/sorting-options/wrappers/sorting-options-ies/sorting-options-ies'
import type { Module } from '@/lib/module'

const module: Module = '4'

export default function IesPage() {
  return (
    <LayoutSearchPage
      searchLabel="Buscar instituição"
      module={module}
      searchHeader={<SearchHeaderIes module={module} />}
      activeFilters={<ActiveFiltersIes module={module} />}
      filtersPanel={<FiltersPanelIes module={module} />}
      toolbar={<SortingOptionsIes module={module} />}
      results={<SearchResultsIes module={module} />}
      emptyPrompt="Busque uma instituição para ver os resultados"
    />
  )
}
