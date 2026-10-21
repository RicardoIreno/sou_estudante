import { Info } from 'lucide-react'
import { LayoutSearchPage } from '@/components/layout/layout-search-page'
import { ActiveFiltersIes } from '@/components/search/active-filters/wrappers/active-filters-ies/active-filters-ies'
import { FiltersPanelIes } from '@/components/search/filters-panel/wrappers/filters-panel-ies/filters-panel-ies'
import { SearchHeaderIes } from '@/components/search/search-header/wrappers/search-header-ies/search-header-ies'
import { SearchResultsIes } from '@/components/search/search-results/wrappers/search-results-ies/search-results-ies'
import { Callout } from '@/components/ui/callout'
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
      results={<SearchResultsIes module={module} />}
      emptyPrompt="Busque uma instituição para ver os resultados"
      notice={
        <Callout v="blue">
          <Callout.Header>
            <Callout.Icon>
              <Info aria-hidden="true" />
            </Callout.Icon>
            <Callout.HeaderContent>
              <Callout.Tagline>Para você, estudante</Callout.Tagline>
              <Callout.Title>Os números dão contexto.</Callout.Title>
            </Callout.HeaderContent>
          </Callout.Header>
          <Callout.Content>
            <p>
              Aqui você encontra um retrato dos aspectos quantitativos da
              instituição: quantos estudantes, quantos cursos, como se compõe o
              corpo docente. Cada número vem do Censo da Educação Superior, com
              ano e fonte declarados.
            </p>
            <p>
              A qualidade se verifica de vários modos — e o conceito Enade do
              curso que você pretende fazer diz muito sobre a instituição. Os
              números daqui dão contexto, não veredito.
            </p>
          </Callout.Content>
          <Callout.Footer>
            — SoU_Estudante · SoU_Ciência / Unifesp · Censo da Educação Superior
          </Callout.Footer>
        </Callout>
      }
    />
  )
}
