import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Header } from './header'

const meta = {
  title: 'Components/Layout/HeaderHomePage',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Inner: Story = {
  args: {
    variant: 'inner',
    module: '1',
  },
}
