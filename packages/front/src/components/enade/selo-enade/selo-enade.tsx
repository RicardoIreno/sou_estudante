/**
 * Molécula SeloEnade — selo do Enade (mar) portado do v21: composição do
 * Céu (CeuEnade), das Ondas (OndasEnade) e do rótulo numérico.
 * A banda de fundo do card vive em BandaMar (formas-enade).
 */
import { paletaMar } from '@/components/enade/formas-enade/geometria-mar'
import MarEnade from '@/components/enade/formas-enade/mar-enade'

export interface SeloEnadeProps {
  level: 1 | 2 | 3 | 4 | 5 | 'SC' | null
  animated?: boolean
  size?: 'card' | 'detalhe'
}

export default function SeloEnade({
  level,
  animated = false,
  size = 'card',
}: SeloEnadeProps) {
  const isNumeric = typeof level === 'number'
  const numericLevel = isNumeric ? level : null
  const isDetail = size === 'detalhe'

  const paleta = paletaMar(numericLevel)

  // Definição do rótulo de acessibilidade e texto principal
  const rotulo = isNumeric
    ? `Conceito Enade ${level} de 5`
    : level === 'SC'
      ? 'Sem conceito (SC)'
      : 'Sem avaliação no ciclo'

  const texto = isNumeric ? String(level) : level === 'SC' ? 'SC' : '—'
  const subtexto = isDetail && isNumeric ? 'de 5' : 'Enade'

  // Mapeamento de estilos de tamanho de fonte e container
  const containerClasses = isDetail
    ? 'h-20 w-20 rounded-[20px]'
    : 'h-10 w-10 rounded-[10px]'

  const fontClasses = isDetail
    ? isNumeric
      ? 'text-protagonist-xl'
      : 'text-protagonist-lg'
    : isNumeric
      ? 'text-protagonist-lg'
      : 'text-coadjuvant'

  const subtextClasses = isDetail
    ? 'mt-[2px] text-coadjuvant-xs'
    : 'mt-px text-coadjuvant-xs tracking-[0.3px]'

  return (
    <div
      role="img"
      aria-label={rotulo}
      title={rotulo}
      className={`relative flex shrink-0 flex-col items-center justify-center overflow-hidden ${containerClasses}`}
      style={{ background: paleta.fundo, color: paleta.cor }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 80 80"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <MarEnade faixa={numericLevel} animated={animated} />
      </svg>

      <div
        className={`relative z-[1] font-mono font-bold leading-none ${fontClasses}`}
      >
        {texto}
      </div>
      <div className={`relative z-[1] font-semibold ${subtextClasses}`}>
        {subtexto}
      </div>
    </div>
  )
}
