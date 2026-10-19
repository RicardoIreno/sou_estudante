import Link from 'next/link'
import { MODULE_META, MODULES, type Module } from '@/lib/module'
import { cn } from '@/utils/cn'

interface RoutesBarProps {
  module?: Module
  className?: string
}

/**
 * Barra de rotas exibida abaixo do cabeçalho nas páginas internas: replica os
 * módulos de navegação e destaca a rota ativa. A borda inferior atravessa a
 * largura total; o conteúdo respeita o container das páginas.
 */
export function RoutesBar({ module, className }: RoutesBarProps) {
  return (
    <nav
      aria-label="Rotas"
      data-module={module}
      className={cn(
        'border-b border-card-border bg-surface-lv2-lv2-lv1',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-pages items-center gap-6 overflow-x-auto px-5">
        <ul className="flex items-center gap-6">
          {MODULES.map((item) => {
            const meta = MODULE_META[item]
            const isActive = item === module

            return (
              <li key={item} data-module={item} className="shrink-0">
                <Link
                  href={meta.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 border-b-2 py-3 text-xs transition-colors duration-fast',
                    isActive
                      ? 'border-accent font-semibold text-accent-deep'
                      : 'border-transparent text-fg-muted hover:text-fg',
                  )}
                >
                  <span
                    aria-hidden
                    className="size-2 shrink-0 rounded-full bg-accent"
                  />
                  {meta.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
