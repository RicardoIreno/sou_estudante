'use client'

import Link from 'next/link'
import { Typo } from '@/components/ui/typo'
import type { Module } from '@/lib/module'
import { MAX_COMPARE, useCompareCursos } from './compare-provider'

interface CompareBarProps {
  module?: Module
}

/**
 * CTA de comparação exibido na busca de cursos quando o modo de comparação
 * está ativo e há 2+ cursos selecionados: resume a seleção e leva a /comparar.
 */
export function CompareBar({ module }: CompareBarProps) {
  const { ids, isComparing } = useCompareCursos()

  if (!isComparing || ids.length < 2) {
    return null
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-4 rounded-panel border border-accent/40 bg-accent/10 p-4">
      <Typo v="accent" s="sm" t="p">
        {ids.length} de {MAX_COMPARE} cursos selecionados para comparar
      </Typo>
      <Link
        href="/comparar"
        data-module={module}
        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent bg-accent px-4 py-1 font-sans text-sm font-bold text-accent-fg shadow-md transition duration-300 hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
      >
        Comparar ({ids.length})
      </Link>
    </div>
  )
}
