import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type CalloutVariant = 'info' | 'future'

export interface CalloutRootProps extends HTMLAttributes<HTMLDivElement> {
  v?: CalloutVariant
  children?: ReactNode
}

const variantStyles: Record<CalloutVariant, string> = {
  info: 'border border-callout-accent/40 text-callout-accent-deep',
  future:
    'border-2 border-dashed border-callout-accent text-callout-accent-deep',
}

export const CalloutRoot = ({
  v = 'info',
  children,
  className,
  ...props
}: CalloutRootProps) => {
  return (
    <div
      role="note"
      data-variant={v}
      className={cn(
        'callout rounded-callout bg-callout-surface p-3 px-4 font-sans text-xs leading-[1.6]',
        variantStyles[v],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
