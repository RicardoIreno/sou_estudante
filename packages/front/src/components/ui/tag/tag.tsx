import type { HTMLAttributes, ReactNode } from 'react'
import type { Module } from '@/lib/module'
import { cn } from '@/utils/cn'

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  label: string
  module?: Module
  icon?: ReactNode
  source?: string
}

export const Tag = ({
  label,
  module,
  icon,
  source,
  className,
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

  if (module) {
    return (
      <span
        data-module={module}
        {...props}
        className={cn(
          'mr-1 inline-flex items-center gap-1 rounded-2xl border border-accent/80 px-2 py-1',
          'bg-accent/20 font-coadjuvant text-accent-deep text-coadjuvant-xs font-bold',
          'transition duration-300',
          className,
        )}
      >
        {content}
      </span>
    )
  }

  return (
    <span
      {...props}
      className={cn(
        'mr-1 inline-flex items-center gap-1 rounded-2xl border border-plum-100 px-2 py-1',
        'bg-site-background font-coadjuvant text-text-muted text-coadjuvant-xs font-semibold',
        'transition duration-300',
        className,
      )}
    >
      {content}
    </span>
  )
}
