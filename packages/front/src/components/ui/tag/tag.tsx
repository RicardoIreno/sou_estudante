import type { HTMLAttributes, ReactNode } from 'react'
import type { Module } from '@/lib/module'
import { cn } from '@/utils/cn'

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  label: string
  module?: Module
  icon?: ReactNode
  source?: string
  variant?: 'module' | 'curso' | 'none'
}

export const Tag = ({
  label,
  module,
  icon,
  source,
  className,
  variant = 'none',
  ...props
}: TagProps) => {
  const content = (
    <>
      {icon}
      {label}
      {source && (
        <span className="font-normal text-coadjuvant-xxs opacity-70">
          · {source}
        </span>
      )}
    </>
  )

  const colors = {
    module: 'bg-accent/20 border-accent/80 text-accent-deep',
    curso: 'bg-sky-100/50 border-sky-300 text-sky-950',
    none: 'bg-site-background border-plum-100 text-text-muted'

  }

  // if (module) {
  //   return (
  //     <span
  //       data-module={module}
  //       {...props}
  //       className={cn(
  //         'mr-2 mb-2 inline-flex items-center gap-1 rounded-2xl border border-accent/80 px-2 py-1',
  //         'bg-accent/20 font-coadjuvant text-accent-deep text-coadjuvant-xs font-bold',
  //         'transition duration-300',
  //         className,
  //       )}
  //     >
  //       {content}
  //     </span>
  //   )
  // }

  return (
    <span
      data-module={module}
      {...props}
      className={cn(
  
        'mr-1 inline-flex items-center gap-1 rounded-2xl border px-2 py-1',
        'font-semibold font-coadjuvant text-text-muted text-coadjuvant-xs ',
        'transition duration-300',
        `${colors[variant]} ${className}`,
        className,
      )}
    >
      {content}
    </span>
  )
}
