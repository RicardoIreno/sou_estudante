import type { ReactNode } from 'react'
import { Tag } from '@/components/ui/tag/tag'
import { cn } from '@/utils/cn'
import { useCardModule } from './card-context'

export interface CardTag {
  label: string
  icon?: ReactNode
  source?: string
  tone?: 'accent' | 'neutral'
}

interface Props {
  className?: string
  source: Array<string | CardTag>
}

const isCardTag = (item: string | CardTag): item is CardTag =>
  typeof item !== 'string'

export const CardTags = ({ className, source }: Props) => {
  const module = useCardModule()

  return (
    <div className={cn('flex flex-wrap gap-y-1 py-1', className)}>
      {source.map((item) => {
        const tag: CardTag = isCardTag(item) ? item : { label: item }
        return (
          <Tag
            key={tag.label}
            label={tag.label}
            icon={tag.icon}
            source={tag.source}
            module={tag.tone === 'neutral' ? undefined : module}
          />
        )
      })}
    </div>
  )
}
