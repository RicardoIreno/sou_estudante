import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MapPin } from 'lucide-react'
import SeloEnade from '@/components/enade/selo-enade/selo-enade'
import { Card } from './index'

const meta = {
  component: Card,
  title: 'Components/Ui/Card',
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '',
    v: 'prev',
    module: '1',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header
        title="ENGENHARIA METALÚRGICA E ENGENHARIA DE MATERIAISa"
        subtitle="UFMG"
      >
        <SeloEnade faixa={4} />
      </Card.Header>
      <Card.Tags
        source={['Gratuito', 'Presencial', 'matutino']}
        className="ml-11"
      />
      <Card.ProgressBar title="Teste" percentage={'50%'} />
    </Card>
  ),
}

export const Variant1: Story = {
  args: {
    children: '',
    v: 'prev',
    module: '1',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header title="Curso tal" subtitle="Instiuição"></Card.Header>
      <SeloEnade faixa={4} />
      <Card.Tags source={['Gratuito', 'FUVEST']} className="ml-11" />
      <Card.ProgressBar title="Teste" percentage={'50%'} />
    </Card>
  ),
}

export const Module3: Story = {
  args: {
    children: '',
    v: 'full',
    module: '3',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header title="Algum título" subtitle="algum subtítulo">
        <SeloEnade faixa={3} />
      </Card.Header>
      <Card.Tags source={['Gratuito', 'FUVEST']} className="ml-11" />
      <Card.ProgressBar title="Teste" percentage={'50%'} />
    </Card>
  ),
}

export const WithRichTags: Story = {
  args: {
    children: '',
    module: '2',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Tags
        source={[
          'Gratuito',
          {
            label: 'Tubarão, SC',
            source: 'Censo',
            icon: <MapPin className="size-3" aria-hidden />,
          },
          { label: '19 vagas', source: 'Censo', tone: 'neutral' },
        ]}
      />
      <Card.ProgressBar title="Taxa de desistência" percentage="26%" />
    </Card>
  ),
}

export const WithFields: Story = {
  args: {
    children: '',
    module: '4',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Header
        title="Universidade Federal do Mato Grosso"
        subtitle="• UFMT"
      />
      <Card.Tags
        source={['Pública Federal', 'Universidade', 'Centro-Oeste']}
        className="ml-11"
      />
      <Card.Fields
        className="ml-11 mt-2"
        items={[{ label: 'Localização', value: 'Cuiabá - MT' }]}
      />
    </Card>
  ),
}
