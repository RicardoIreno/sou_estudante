'use client'

import Link from 'next/link'
import { CompareActions } from '@/components/compare/compare-actions'
import { useCompareCursos } from '@/components/compare/compare-provider'
import { BackLink } from '@/components/ui/back-link/back-link'
import { MODULE_META, type Module } from '@/lib/module'
import { cn } from '@/utils/cn'
import { NauticalIcon } from '../../ui/route/icons/nautical-icon'
import { Menu } from '../menu/menu'

export type HeaderVariant = 'home' | 'inner'

interface HeaderProps {
  className?: string
  variant?: HeaderVariant
  module?: Module
}

export const Header = ({
  className,
  variant = 'home',
  module,
}: HeaderProps) => {
  const { ids } = useCompareCursos()
  const comparing = ids.length > 0

  if (variant === 'inner') {
    return (
      <header
        className={cn(
          'sticky top-0 z-[600] flex h-[64px] items-center justify-between bg-site-background px-5',
          'mx-auto w-full',
          className,
        )}
      >
        <BackLink label="Voltar" />

        <div className="flex items-center gap-3">
          {module &&
            (comparing ? (
              <CompareActions variant="neutral" />
            ) : (
              <Link
                data-module={module}
                href={MODULE_META[module].href}
                className="rounded-full bg-accent px-[1.15rem] py-2 text-xs font-semibold text-fg transition-transform duration-fast hover:-translate-y-px"
              >
                {MODULE_META[module].title}
              </Link>
            ))}
          <Menu mode="light" />
        </div>
      </header>
    )
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-[600] flex h-[52px] items-center justify-between bg-navy-900 px-5',
        'mx-auto w-full',
        className,
      )}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <span aria-hidden className="block h-7 w-7">
          <NauticalIcon className="w-7 h-7" />
        </span>
        <span className="text-sm font-semibold tracking-[-0.2px] text-on-dark">
          So<span className="text-m1-accent">U</span>_Estudante
        </span>
      </Link>
      <div className="flex items-center gap-3 text-xs text-on-dark/[.45]">
        <a
          href="https://souciencia.unifesp.br"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-fast hover:text-on-dark/80"
        >
          SoU_Ciência
        </a>
        <Menu mode="dark" />
      </div>
    </header>
  )
}
