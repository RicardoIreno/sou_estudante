import { type ReactNode, Suspense } from 'react'
import { RoutesBar } from '@/components/layout/routes-bar/routes-bar'
import { SearchGate } from '@/components/search/search-gate/search-gate'
import IconModule from '@/components/ui/icon-module/iconModule'
import { Typo } from '@/components/ui/typo'
import { MODULE_META, type Module } from '@/lib/module'
import { cn } from '@/utils/cn'

const DEFAULT_EMPTY_PROMPT = 'Faça uma busca para ver os resultados'

interface LayoutSearchPageProps {
  module?: Module
  searchLabel?: string
  searchHeader?: ReactNode
  activeFilters?: ReactNode
  filtersPanel?: ReactNode
  toolbar?: ReactNode
  results?: ReactNode
  /** Mínimo de caracteres em `q` para considerar que houve busca. */
  minQueryLength?: number
  /** Override de "houve busca" — usado em testes e stories. */
  hasSearched?: boolean
  /** Mensagem exibida enquanto nenhuma busca foi realizada. */
  emptyPrompt?: ReactNode
}

export function LayoutSearchPage({
  module,
  searchLabel = 'Buscar',
  searchHeader,
  activeFilters,
  filtersPanel,
  toolbar,
  results,
  minQueryLength,
  hasSearched,
  emptyPrompt,
}: LayoutSearchPageProps) {
  const meta = module ? MODULE_META[module] : undefined
  const hasSearch = Boolean(searchHeader)
  const hasResults = Boolean(filtersPanel || toolbar || results)
  const showPrompt = hasSearch || hasResults

  return (
    <div data-module={module}>
      <RoutesBar module={module} />

      <div className="mx-auto w-full max-w-pages px-5 py-8">
        {meta && module && (
          <header className="mb-6">
            <div className="mb-2 flex items-center gap-2 font-coadjuvant text-coadjuvant-xs font-bold tracking-[0.9px] text-accent-deep uppercase">
              <IconModule module={module} />
              {meta.badge}
            </div>

            <h1 className="block font-protagonist text-protagonist-2xl font-bold leading-[1.08] tracking-[-0.02em] text-fg-protagonist">
              {meta.page.lead}{' '}
              <em className="font-bold text-accent-deep italic">
                {meta.page.accent}
              </em>
            </h1>

            <p className="mt-1.5 font-protagonist text-protagonist text-fg-muted">
              {meta.page.subtitle}
            </p>
          </header>
        )}

        {hasSearch && (
          <>
            <div className="mb-2 font-coadjuvant text-coadjuvant-xs font-bold tracking-[0.9px] text-accent-deep uppercase">
              {searchLabel}
            </div>

            <Suspense
              fallback={
                <Typo v="mute" s="sm">
                  Carregando busca...
                </Typo>
              }
            >
              {searchHeader}
            </Suspense>
          </>
        )}

        {showPrompt && (
          <SearchRegion
            hasSearched={hasSearched}
            minQueryLength={minQueryLength}
            fallback={
              <div className="py-8 text-center">
                <Typo v="mute" s="sm" t="p" className="cursor-auto">
                  {emptyPrompt ?? DEFAULT_EMPTY_PROMPT}
                </Typo>
              </div>
            }
          >
            {hasSearch && <Suspense fallback={null}>{activeFilters}</Suspense>}

            {hasResults && (
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
                {filtersPanel && (
                  <aside className="md:col-span-1">
                    <Suspense
                      fallback={
                        <Typo v="mute" s="sm">
                          Carregando filtros...
                        </Typo>
                      }
                    >
                      {filtersPanel}
                    </Suspense>
                  </aside>
                )}

                <main
                  className={cn('space-y-4', {
                    'md:col-span-3': Boolean(filtersPanel),
                    'md:col-span-4': !filtersPanel,
                  })}
                >
                  {toolbar && <Suspense fallback={null}>{toolbar}</Suspense>}

                  {results && (
                    <Suspense
                      fallback={
                        <Typo v="mute" s="sm">
                          Carregando resultados...
                        </Typo>
                      }
                    >
                      {results}
                    </Suspense>
                  )}
                </main>
              </div>
            )}
          </SearchRegion>
        )}
      </div>
    </div>
  )
}

interface SearchRegionProps {
  hasSearched?: boolean
  minQueryLength?: number
  fallback: ReactNode
  children: ReactNode
}

/**
 * Decide se a região de busca (filtros, ordenação e resultados) deve aparecer.
 * Quando `hasSearched` é informado (testes/stories), usa o valor direto;
 * caso contrário, lê `q` da URL via `SearchGate`.
 */
function SearchRegion({
  hasSearched,
  minQueryLength,
  fallback,
  children,
}: SearchRegionProps) {
  if (hasSearched !== undefined) {
    return hasSearched ? children : fallback
  }

  return (
    <Suspense fallback={fallback}>
      <SearchGate minQueryLength={minQueryLength} fallback={fallback}>
        {children}
      </SearchGate>
    </Suspense>
  )
}
