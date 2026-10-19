import { cn } from '@/utils/cn'
import { Section, SubSection, Swatch, SwatchGrid } from '../kit'

export function Tokens() {
  return (
    <Section
      id="tokens"
      title="Tokens"
      description="Fonte única em src/app/globals.css (@theme). Os valores abaixo são lidos direto dos tokens — não são copiados para cá."
    >
      <SubSection title="Acentos por módulo">
        <SwatchGrid>
          {MODULE_COLORS.map(({ token, name, value }) => (
            <Swatch key={token} token={token} name={name} value={value} />
          ))}
        </SwatchGrid>
      </SubSection>

      <SubSection title="Feedback">
        <SwatchGrid>
          {FEEDBACK_COLORS.map(({ token, name, value }) => (
            <Swatch key={token} token={token} name={name} value={value} />
          ))}
        </SwatchGrid>
      </SubSection>

      <SubSection title="Neutros e superfícies">
        <SwatchGrid>
          {NEUTRAL_COLORS.map(({ token, name, value }) => (
            <Swatch key={token} token={token} name={name} value={value} />
          ))}
        </SwatchGrid>
      </SubSection>

      <SubSection title="Tipografia">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-6">
            <span className="font-sans text-base text-fg">
              Sans · corpo · <span className="font-semibold">semibold</span>
            </span>
            <span className="font-display text-base text-fg">
              Display · títulos
            </span>
            <span className="font-mono text-base text-fg">Mono · dados</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-6 rounded-panel border border-surface-border bg-surface-lv2 p-5">
            {FONT_SCALE.map(({ className, label }) => (
              <span key={label} className={className}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </SubSection>

      <SubSection title="Formas (raios)">
        <div className="flex flex-wrap items-center gap-6 rounded-panel border border-surface-border bg-surface-lv2 p-5">
          {RADII.map(({ className, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  'block h-16 w-16 border border-accent bg-accent/10',
                  className,
                )}
              />
              <span className="font-mono text-2xs text-fg-muted">{label}</span>
            </div>
          ))}
        </div>
      </SubSection>
    </Section>
  )
}

const MODULE_COLORS = [
  { token: '--color-m1-accent', name: 'm1 accent', value: '#00e5ff' },
  { token: '--color-m1-deep', name: 'm1 deep', value: '#006b78' },
  { token: '--color-m2-accent', name: 'm2 accent', value: '#d4ff00' },
  { token: '--color-m2-deep', name: 'm2 deep', value: '#5a6e00' },
  { token: '--color-m3-accent', name: 'm3 accent', value: '#ff67be' },
  { token: '--color-m3-deep', name: 'm3 deep', value: '#a61e6b' },
  { token: '--color-m4-accent', name: 'm4 accent', value: '#ae64fe' },
  { token: '--color-m4-deep', name: 'm4 deep', value: '#5b21a8' },
  { token: '--color-m5-accent', name: 'm5 accent', value: '#ff8d3b' },
  { token: '--color-m5-deep', name: 'm5 deep', value: '#a34a00' },
]

const FEEDBACK_COLORS = [
  { token: '--color-ok', name: 'enade ok', value: '#1b8a5a' },
  {
    token: '--color-ok-surface',
    name: 'enade ok surface',
    value: '#e8f7f0',
  },
  { token: '--color-warn', name: 'enade warn', value: '#b06000' },
  {
    token: '--color-warn-surface',
    name: 'enade warn surface',
    value: '#fff3e0',
  },
  { token: '--color-low', name: 'enade low', value: '#c0392b' },
  {
    token: '--color-low-surface',
    name: 'enade low surface',
    value: '#fdecea',
  },
  { token: '--color-info-surface', name: 'info surface', value: '#f0f9ff' },
  { token: '--color-info-border', name: 'info border', value: '#b3e0f0' },
]

const NEUTRAL_COLORS = [
  { token: '--color-fg', name: 'fg', value: '#1a0e23' },
  { token: '--color-fg-muted', name: 'fg muted', value: '#5b5266' },
  { token: '--color-muted', name: 'muted', value: 'gray-100' },
  { token: '--color-card-surface', name: 'card surface', value: 'white' },
  { token: '--color-surface-border', name: 'card border', value: 'oklch 0.92' },
  {
    token: '--color-site-background',
    name: 'site background',
    value: '#f8f4fb',
  },
  { token: '--color-on-dark', name: 'on dark', value: '#fff' },
]

const FONT_SCALE = [
  { className: 'font-sans text-2xs text-fg', label: '2xs 10px' },
  { className: 'font-sans text-xs text-fg', label: 'xs 12px' },
  { className: 'font-sans text-sm text-fg', label: 'sm 14px' },
  { className: 'font-sans text-base text-fg', label: 'base 16px' },
  { className: 'font-sans text-xl text-fg', label: 'xl 20px' },
  { className: 'font-sans text-4xl text-fg', label: '4xl 36px' },
  { className: 'font-display text-display text-fg', label: 'display' },
]

const RADII = [
  { className: 'rounded-card', label: 'card 20px' },
  { className: 'rounded-callout', label: 'callout 18px' },
  { className: 'rounded-panel', label: 'panel 14px' },
  { className: 'rounded-control', label: 'control 10px' },
  { className: 'rounded-full', label: 'full' },
]
