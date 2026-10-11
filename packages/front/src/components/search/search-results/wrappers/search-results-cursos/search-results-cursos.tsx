'use client'

import { SearchResults } from '@/components/search/search-results/search-results'
import type { Module } from '@/lib/module'
import type { Curso } from '@/services/api/types'
import { useSearchCursos } from '@/services/api/use-search-cursos'
import { SearchResultItem } from './search-result-item'

interface SearchResultsCursosProps {
  module?: Module
}

export function SearchResultsCursos({ module }: SearchResultsCursosProps) {
  const {
    results,
    isLoading,
    error,
    total,
    currentPage,
    limit,
    links,
    navigateToPage,
  } = useSearchCursos()

  return (
    <SearchResults<Curso>
      items={results}
      isLoading={isLoading}
      error={error}
      total={total}
      currentPage={currentPage}
      limit={limit}
      links={links}
      onNavigate={navigateToPage}
      labels={{ singular: 'curso', plural: 'cursos' }}
      emptyMessage="Nenhum curso encontrado"
      showCount={false}
      getItemKey={(curso, index) =>
        curso.sequencial
          ? `seq-${curso.sequencial}`
          : `${curso.instituicao?.co_ies}-${curso.curso?.co_curso}-${index}`
      }
      renderItem={(curso) => <SearchResultItem curso={curso} module={module} />}
      module={module}
    />
  )
}
