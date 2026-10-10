import {
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
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
  source: Array<string | CardTag | ReactElement>
}

const isCardTag = (item: unknown): item is CardTag =>
  typeof item === 'object' && item !== null && !isValidElement(item)

export const CardTags = ({ className, source }: Props) => {
  const module = useCardModule()

  return (
    <div className={cn(
      'flex flex-wrap gap-y-1 py-1', 
      className)}
      >
      {source.map((item, index) => {
        if (isValidElement(item)) {
          return <Fragment key={item.key ?? index}>{item}</Fragment>
        }

        const tag: CardTag = isCardTag(item) ? item : { label: item }
        return (
          <Tag
            key={tag.label}
            label={tag.label}
            icon={tag.icon}
            source={tag.source}
            module={tag.tone === 'neutral' ? undefined : module}
            variant='curso'
          />
        )
      })}
    </div>
  )
}
