/**
 * Átomo MarEnade — composição do "mar do Enade" (Céu + Ondas), compartilhada
 * pelo SeloEnade (badge) e pelo MaskEnade (fundo do card). Não emite `<svg>`
 * próprio: cada consumidor define viewBox/preserveAspectRatio e a cor
 * (`color`/background) a partir de `paletaMar`.
 */
import CeuEnade from '@/components/enade/formas-enade/ceu-enade'
import { parametrosMar } from '@/components/enade/formas-enade/geometria-mar'
import OndasEnade from '@/components/enade/formas-enade/ondas-enade'
import type { EnadeLevel } from '@/lib/enade'

interface Props {
  faixa: EnadeLevel
  animated?: boolean
}

export default function MarEnade({ faixa, animated = false }: Props) {
  const numerica = typeof faixa === 'number' ? faixa : null

  return (
    <>
      <CeuEnade faixa={numerica} />
      <OndasEnade params={parametrosMar(numerica)} animado={animated} />
    </>
  )
}
