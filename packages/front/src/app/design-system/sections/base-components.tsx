'use client'

import { Info, MapPin, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { BackLink } from '@/components/ui/back-link/back-link'
import { BottomSheet } from '@/components/ui/bottom-sheet/bottom-sheet'
import { Button } from '@/components/ui/button/button'
import { Callout } from '@/components/ui/callout'
import { Card } from '@/components/ui/card'
import { SkeletonCard } from '@/components/ui/card/skeleton-card'
import { Checkbox } from '@/components/ui/checkbox/checkbox'
import { ErrorMessage } from '@/components/ui/error-message'
import { IconModule } from '@/components/ui/icon-module/icon-module'
import { IconTile } from '@/components/ui/icon-tile/icon-tile'
import { Route } from '@/components/ui/route/route'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch/switch'
import { Tag } from '@/components/ui/tag/tag'
import { Typo } from '@/components/ui/typo'
import { MODULES } from '@/lib/module'
import { Section, State, States, SubSection } from '../kit'

export function BaseComponents() {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <Section
      id="base"
      title="Componentes base"
      description="Matriz de estados de cada primitivo de ui/. Hover é coberto pelas classes CSS (não dá para fixar aqui); os estados determinísticos (default, active, disabled, loading, erro, tamanhos, variantes) ficam lado a lado."
    >
      <SubSection title="Button · v (chip | solid | outline)">
        <States>
          {BUTTON_VARIANTS.map((v) => (
            <State key={v} label={v}>
              <Button v={v}>Ação</Button>
            </State>
          ))}
          <State label="chip · active">
            <Button active>Ação</Button>
          </State>
          <State label="solid · disabled">
            <Button v="solid" disabled>
              Ação
            </Button>
          </State>
        </States>
      </SubSection>

      <SubSection title="Button · tema por módulo (solid)">
        <States>
          {MODULES.map((module) => (
            <State key={module} label={`module ${module}`}>
              <Button module={module} v="solid">
                Ação
              </Button>
            </State>
          ))}
        </States>
      </SubSection>

      <SubSection title="Tag · variant (module | curso | none)">
        <States>
          <State label="module">
            <Tag label="Gratuito" variant="module" module="1" />
          </State>
          <State label="curso">
            <Tag label="Tubarão, SC" variant="curso" source="Censo" />
          </State>
          <State label="none">
            <Tag label="Presencial" />
          </State>
          <State label="com ícone">
            <Tag
              label="Tubarão, SC"
              variant="curso"
              source="Censo"
              icon={<MapPin className="size-3" aria-hidden="true" />}
            />
          </State>
        </States>
      </SubSection>

      <SubSection title="Typo · v × s">
        <States>
          {TYPO_STATES.map(({ label, v, s }) => (
            <State key={label} label={label}>
              <Typo v={v} s={s}>
                Texto de exemplo
              </Typo>
            </State>
          ))}
        </States>
      </SubSection>

      <SubSection title="Checkbox">
        <States>
          <State label="unchecked">
            <Checkbox aria-label="Sem seleção" />
          </State>
          <State label="checked">
            <Checkbox defaultChecked aria-label="Selecionado" />
          </State>
          <State label="disabled">
            <Checkbox disabled aria-label="Desabilitado" />
          </State>
        </States>
      </SubSection>

      <SubSection title="Switch · size × estado">
        <States>
          <State label="md · off">
            <Switch
              checked={false}
              onCheckedChange={() => {}}
              aria-label="off"
            />
          </State>
          <State label="md · on">
            <Switch checked onCheckedChange={() => {}} aria-label="on" />
          </State>
          <State label="sm · on">
            <Switch
              checked
              size="sm"
              onCheckedChange={() => {}}
              aria-label="on sm"
            />
          </State>
          <State label="md · disabled">
            <Switch
              checked
              disabled
              onCheckedChange={() => {}}
              aria-label="disabled"
            />
          </State>
        </States>
      </SubSection>

      <SubSection title="Feedback · Spinner, ErrorMessage, SkeletonCard">
        <States>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <State key={size} label={`spinner ${size}`}>
              <Spinner size={size} />
            </State>
          ))}
          <State label="erro" className="min-w-64">
            <ErrorMessage message="Não foi possível carregar os dados." />
          </State>
          <State label="loading (skeleton)" className="min-w-64">
            <SkeletonCard />
          </State>
        </States>
      </SubSection>

      <SubSection title="BackLink e IconTile/IconModule">
        <States>
          <State label="back link">
            <BackLink label="Voltar" />
          </State>
          <State label="icon tile">
            <IconTile module="1">
              <IconModule module="1" />
            </IconTile>
          </State>
          {MODULES.map((module) => (
            <State key={module} label={`icon module ${module}`}>
              <IconTile module={module}>
                <IconModule module={module} />
              </IconTile>
            </State>
          ))}
        </States>
      </SubSection>

      <SubSection title="Route · variant (card | inline | list)">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-panel border border-card-border bg-surface-lv2 p-4">
            <Route module="2" />
          </div>
          <div className="rounded-panel border border-card-border bg-surface-lv2 p-4">
            <Route module="3" variant="inline" />
          </div>
          <div className="rounded-panel border border-card-border bg-surface-lv2 p-4 md:col-span-2">
            <Route module="5" variant="list" />
          </div>
        </div>
      </SubSection>

      <SubSection title="Callout · v (info | future)">
        <div className="grid gap-4 md:grid-cols-2">
          <Callout v="info">
            <Callout.Header>
              <Callout.Icon>
                <Info aria-hidden="true" />
              </Callout.Icon>
              <Callout.HeaderContent>
                <Callout.Tagline>Info</Callout.Tagline>
                <Callout.Title>
                  O conceito Enade é avaliado por ciclos
                </Callout.Title>
              </Callout.HeaderContent>
            </Callout.Header>
            <Callout.Content>
              Nem todos os cursos são avaliados no mesmo ano.
            </Callout.Content>
            <Callout.Footer>Fonte: Inep</Callout.Footer>
          </Callout>

          <Callout v="future">
            <Callout.Header>
              <Callout.Icon>
                <TrendingUp aria-hidden="true" />
              </Callout.Icon>
              <Callout.HeaderContent>
                <Callout.Tagline>Em breve</Callout.Tagline>
                <Callout.Title>Progressão das notas</Callout.Title>
              </Callout.HeaderContent>
            </Callout.Header>
            <Callout.Content>
              A evolução das notas ao longo dos ciclos, para ler tendências.
            </Callout.Content>
          </Callout>
        </div>
      </SubSection>

      <SubSection title="BottomSheet · interativo">
        <div className="flex flex-wrap items-center gap-4">
          <Button v="solid" onClick={() => setSheetOpen(true)}>
            Abrir bottom sheet
          </Button>
          <span className="text-xs text-fg-muted">
            (também fecha por Esc, toque no véu ou no X)
          </span>
        </div>
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          labelledBy="design-sheet-title"
        >
          <div className="px-4 pb-6 pt-2">
            <h3
              id="design-sheet-title"
              className="font-display text-lg font-bold text-fg"
            >
              Filtros
            </h3>
            <p className="mt-2 text-sm text-fg-muted">
              Exemplo de conteúdo do bottom sheet usado no mobile.
            </p>
          </div>
        </BottomSheet>
      </SubSection>

      <SubSection title="Card · composição de partes">
        <div className="grid gap-4 md:grid-cols-2">
          <Card module="1">
            <Card.Header>
              <Card.Title
                title="Medicina"
                subtitle="Universidade Federal de Roraima"
              />
            </Card.Header>
            <Card.Tags
              source={[
                'Gratuito',
                'Presencial',
                { label: 'Boa Vista - RR', source: 'Censo' },
              ]}
            />
            <Card.ProgressBar title="Taxa de desistência" percentage="17%" />
          </Card>

          <Card module="4" v="full">
            <Card.Header v="full">
              <Card.Title title="Card full" subtitle="variante com gradiente" />
            </Card.Header>
            <Card.Fields
              items={[
                { label: 'Localização', value: 'Cuiabá - MT' },
                { label: 'Rede', value: 'Pública Federal' },
              ]}
            />
            <Card.ProgressBar
              title="Taxa de desistência"
              emptyHint="sem dados"
            />
          </Card>
        </div>
      </SubSection>
    </Section>
  )
}

const BUTTON_VARIANTS = ['chip', 'solid', 'outline'] as const

const TYPO_STATES = [
  { label: 'normal · sm', v: 'normal', s: 'sm' },
  { label: 'normal · md', v: 'normal', s: 'md' },
  { label: 'title · xl', v: 'title', s: 'xl' },
  { label: 'mute · sm', v: 'mute', s: 'sm' },
  { label: 'accent · md', v: 'accent', s: 'md' },
] as const
