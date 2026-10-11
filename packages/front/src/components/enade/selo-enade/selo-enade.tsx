/**
 * Molécula SeloEnade — selo do Enade (mar): composição do desenho da faixa
 * (ConceitoEnade) e do rótulo numérico. A banda de fundo do card vive em
 * ConceitoEnade, usada também pelo MaskEnade.
 */
import { ConceitoEnade } from '@/components/enade/formas-enade/conceito-enade'
import { marPalette } from '@/components/enade/formas-enade/geometria-mar'
import { cn } from '@/utils/cn'

export interface SeloEnadeProps {
  level: 1 | 2 | 3 | 4 | 5 | 'SC' | null
  size?: 'card' | 'detalhe'
}

export function SeloEnade({ level, size = 'card' }: SeloEnadeProps) {
  const isNumeric = typeof level === 'number'
  const numericLevel = isNumeric ? level : null
  const isDetail = size === 'detalhe'

  const palette = marPalette(numericLevel)

  // Definição do rótulo de acessibilidade e text principal
  const label = isNumeric
    ? `Conceito Enade ${level} de 5`
    : level === 'SC'
      ? 'Sem conceito (SC)'
      : 'Sem avaliação no ciclo'

  const text = isNumeric ? String(level) : level === 'SC' ? 'SC' : '—'
  const subtext = isDetail && isNumeric ? 'de 5' : 'Enade'

  // Mapeamento de estilos de tamanho de fonte e container
  const containerClasses = isDetail
    ? 'h-20 w-20 rounded-card'
    : 'h-10 w-10 rounded-control'

  const fontClasses = isDetail
    ? isNumeric
      ? 'text-4xl'
      : 'text-xl'
    : isNumeric
      ? 'text-xl'
      : 'text-sm'

  const subtextClasses = isDetail
    ? 'mt-[2px] text-xs'
    : 'mt-px text-xs tracking-[0.3px]'

  return (
    <div
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        'relative flex shrink-0 flex-col items-center justify-center overflow-hidden',
        containerClasses,
      )}
      style={{ background: palette.background, color: palette.color }}
    >
      <ConceitoEnade
        level={level}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div
        className={cn(
          'relative z-[1] font-mono font-bold leading-none',
          fontClasses,
        )}
      >
        {text}
      </div>
      <div className={cn('relative z-[1] font-semibold', subtextClasses)}>
        {subtext}
      </div>
    </div>
  )
}
