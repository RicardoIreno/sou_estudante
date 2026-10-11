'use client'

import { usePathname } from 'next/navigation'
import { moduleFromPathname } from '@/lib/module'
import { Header } from './header'

export const ShellHeader = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isInner =
    pathname === '/cursos' ||
    pathname === '/ies' ||
    pathname === '/ingresso' ||
    pathname === '/comparar' ||
    pathname === '/permanencia'

  if (isHome) {
    return <Header variant="home" className="max-w-home" />
  }

  if (isInner) {
    return (
      <Header
        variant="inner"
        module={moduleFromPathname(pathname)}
        className="max-w-pages"
      />
    )
  }
}
