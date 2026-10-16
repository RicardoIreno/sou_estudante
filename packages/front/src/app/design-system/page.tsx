import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Design System',
  robots: { index: false, follow: false },
}

const DesignSystem = dynamic(() => import('./design-system'))

/**
 * Página interna de design system: oculta dos menus e só acessível em dev ou
 * quando a flag `NEXT_PUBLIC_DESIGN_SYSTEM=1` está ligada (staging). Em
 * produção, responde 404 e nunca é indexada (`robots: noindex, nofollow`).
 * O conteúdo é carregado em lazy loading (`dynamic` + `ssr: false`).
 */
export default function Page() {
  if (!isDesignSystemEnabled()) {
    notFound()
  }

  return <DesignSystem />
}

function isDesignSystemEnabled() {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_DESIGN_SYSTEM === '1'
  )
}
