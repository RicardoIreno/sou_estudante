'use client'

import { Button } from '@/components/ui/button/button'
import type { Module } from '@/lib/module'
import { cn } from '@/utils/cn'

export interface SortOption {
  label: string
  value: string
}

export interface SortingOptionsProps {
  options: SortOption[]
  onSelect: (value: string) => void
  /** Valor da ordenação ativa; usado para marcar o botão correspondente. */
  value?: string
  ariaLabel?: string
  module?: Module
  className?: string
}

/**
 * Grupo de botões de ordenação agnóstico: recebe as opções, o valor ativo e o
 * callback, sem conhecer o endpoint de busca.
 */
export function SortingOptions({
  options,
  onSelect,
  value,
  ariaLabel = 'Ordenar resultados',
  module,
  className,
}: SortingOptionsProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: grupo de botões de ordenação, não um formulário
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('flex flex-wrap gap-2', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <Button
            key={option.value}
            module={module}
            active={active}
            aria-pressed={active}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
