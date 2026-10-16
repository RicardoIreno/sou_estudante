import { EmBreve } from '@/components/layout/em-breve'
import { LayoutSearchPage } from '@/components/layout/layout-search-page'

export default function IngressoPage() {
  return <LayoutSearchPage module="2" notice={<EmBreve />} />
}
