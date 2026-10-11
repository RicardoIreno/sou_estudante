import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { type ReactNode, useEffect } from 'react'
import { CompareBar } from './compare-bar'
import { CompareProvider, useCompareCursos } from './compare-provider'

function SeedSelection({
  ids,
  children,
}: {
  ids: string[]
  children: ReactNode
}) {
  const { toggle, setComparing } = useCompareCursos()
  useEffect(() => {
    for (const id of ids) toggle(id)
    setComparing(true)
  }, [ids, toggle, setComparing])
  return <>{children}</>
}

const meta = {
  title: 'Components/Compare/CompareBar',
  component: CompareBar,
  tags: ['autodocs'],
  args: { module: '1' },
  decorators: [
    (Story) => (
      <CompareProvider>
        <SeedSelection ids={['101', '102', '103']}>
          <Story />
        </SeedSelection>
      </CompareProvider>
    ),
  ],
} satisfies Meta<typeof CompareBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
