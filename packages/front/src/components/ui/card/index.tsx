import { CardBackdrop } from './card-backdrop'
import { CardFields } from './card-fields'
import { CardHeader } from './card-header'
import { CardProgressBar } from './card-progress-bar'
import { CardRoot } from './card-root'
import { CardTags } from './card-tags'
import { CardTitle } from './card-title'

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Tags: CardTags,
  ProgressBar: CardProgressBar,
  Fields: CardFields,
  Title: CardTitle,
  Backdrop: CardBackdrop,
})

export type { CardTag } from './card-tags'
