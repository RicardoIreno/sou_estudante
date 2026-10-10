/**
 * Molécula TagEnade — versão em formato de tag (pílula) do conceito Enade.
 * Reaproveita a paleta do mar (paletaMar) para colorir fundo/borda/texto
 * conforme a faixa, mantendo coerência com o SeloEnade. A informação
 * acessível vive no próprio texto ("Nota 4 no Enade").
 */
import { paletaMar } from '@/components/enade/formas-enade/geometria-mar'
import { Tag } from '@/components/ui/tag/tag'
import type { EnadeLevel } from '@/lib/enade'

export interface TagEnadeProps {
  level: EnadeLevel
  className?: string
}

const rotuloEnade = (level: EnadeLevel): string => {
  if (typeof level === 'number') return `Nota ${level} no Enade`
  if (level === 'SC') return 'Sem conceito no Enade'
  return 'Sem avaliação no Enade'
}

export default function TagEnade({ level, className }: TagEnadeProps) {
  const numerica = typeof level === 'number' ? level : null
  const paleta = paletaMar(numerica)

  return (
    <Tag
      label={rotuloEnade(level)}
      className={className}
      style={{
        background: paleta.fundo,
        borderColor: paleta.cor,
        color: paleta.cor,
      }}
    />
  )
}
