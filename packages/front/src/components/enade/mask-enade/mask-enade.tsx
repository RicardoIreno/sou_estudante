/**
 * MaskEnade — versão decorativa e ampliada do "mar do Enade" usada como fundo
 * do card de curso (ancorada à direita). A "separação" com o card é feita por
 * um `<mask-image>` SVG (silhueta de `docs/imgs/exemplo_mask.png`), e não por
 * um `border-radius`. Reflete a faixa do conceito; sem conceito (`SC`/`null`)
 * cai na neblina. Puramente decorativo: não recebe ponteiro e é `aria-hidden`
 * — a informação acessível vive no SeloEnade.
 */
import { paletaMar } from '@/components/enade/formas-enade/geometria-mar'
import MarEnade from '@/components/enade/formas-enade/mar-enade'
import type { EnadeLevel } from '@/lib/enade'
import { cn } from '@/utils/cn'

// Silhueta da borda esquerda (viewBox 0 0 100 100, esticada ao box do elemento).
const MASK_SHAPE = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='M8.25 0H100V100H8.25C8.25 100 -1.3125 69.5 8.25 50C17.8125 30.5 8.25 0 8.25 0Z' fill='white'/></svg>"
  // "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='M20 0C2 8 0 34 4 50C6 68 1 86 0 100H100V0Z' fill='white'/></svg>",
)

interface Props {
  level: EnadeLevel
  className?: string
}

export default function MaskEnade({ level, className }: Props) {
  const numerica = typeof level === 'number' ? level : null
  const paleta = paletaMar(numerica)
  const maskImage = `url("data:image/svg+xml,${MASK_SHAPE}")`

  return (
    <div
      data-mask="enade"
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-y-0 right-0 w-[26%] max-w-[230px]',
        className,
      )}
      style={{
        background: paleta.fundo,
        color: paleta.cor,
        maskImage,
        WebkitMaskImage: maskImage,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 80 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <MarEnade faixa={level} />
      </svg>
    </div>
  )
}
