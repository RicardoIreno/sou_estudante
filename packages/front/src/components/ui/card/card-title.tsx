import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface Props {
  className?: string
  title: ReactNode
  subtitle?: ReactNode
}

/**
 * Bloco de título/subtítulo de um Card (agnóstico de domínio).
 * O subtítulo só é renderizado quando presente.
 */
export const CardTitle = ({ title, subtitle, className }: Props) => {
  return (
    <div className={cn(className)}>
      <h4 className="px-2 font-title-protagonist font-bold text-protagonist-md">
        {title}
      </h4>
      {subtitle && (
        <h5 className="px-2 font-protagonist text-fg-muted text-protagonist-sm">
          {subtitle}
        </h5>
      )}
    </div>
  )
}
