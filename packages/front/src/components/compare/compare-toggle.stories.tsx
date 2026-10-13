import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CompareProvider } from './compare-provider'
import { CompareToggle } from './compare-toggle'

const meta = {
  title: 'Components/Compare/CompareToggle',
  component: CompareToggle,
  tags: ['autodocs'],
  args: { module: '1' },
  decorators: [
    (Story) => (
      <CompareProvider>
        <Story />
      </CompareProvider>
    ),
  ],
} satisfies Meta<typeof CompareToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
