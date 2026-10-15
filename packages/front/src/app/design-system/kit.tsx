import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold tracking-tight text-fg">
        {title}
      </h2>
      {description && (
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-fg-muted">
          {description}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function SubSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-fg-muted">
        {title}
      </h3>
      {children}
    </div>
  )
}

export function States({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-start gap-4">{children}</div>
}

export function State({
  label,
  note,
  children,
  className,
}: {
  label: string
  note?: string
  children: ReactNode
  className?: string
}) {
  return (
    <figure
      className={cn(
        'flex min-w-36 flex-col gap-2 rounded-panel border border-card-border bg-card-surface p-4',
        className,
      )}
    >
      <div className="flex min-h-12 flex-1 items-center justify-center">
        {children}
      </div>
      <figcaption className="text-center text-xs text-fg-muted">
        <span className="font-semibold text-fg">{label}</span>
        {note && <span className="block font-normal">{note}</span>}
      </figcaption>
    </figure>
  )
}

export function Swatch({
  token,
  name,
  value,
}: {
  token: string
  name: string
  value?: string
}) {
  return (
    <div className="flex min-w-28 flex-col gap-1.5">
      <div
        className="h-14 w-full rounded-control border border-card-border"
        style={{ background: `var(${token})` }}
      />
      <span className="font-sans text-xs font-semibold text-fg">{name}</span>
      {value && (
        <span className="font-mono text-2xs text-fg-muted">{value}</span>
      )}
    </div>
  )
}

export function SwatchGrid({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-5">{children}</div>
}
