import { Button } from '@/components/ui/button/button'
import { SkeletonCard } from '@/components/ui/card/skeleton-card'
import { ErrorMessage } from '@/components/ui/error-message'
import { Route } from '@/components/ui/route/route'
import { MODULES } from '@/lib/module'
import { Section, SubSection } from '../kit'

export function Patterns() {
  return (
    <Section
      id="patterns"
      title="Composições e padrões"
      description="Como os primitivos se combinam. Também demonstra o padrão Scoped-Variable: o mesmo componente muda de acento só pelo data-module."
    >
      <SubSection title="Chips de filtro com seleção">
        <div className="flex flex-wrap gap-2">
          <Button active>Gratuito</Button>
          <Button>Presencial</Button>
          <Button>EAD</Button>
          <Button>Integral</Button>
          <Button v="outline">Noturno</Button>
        </div>
      </SubSection>

      <SubSection title="Acento escopado por módulo (mesmo componente)">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {MODULES.map((module) => (
            <Route key={module} module={module} />
          ))}
        </div>
      </SubSection>

      <SubSection title="Lista em carregamento">
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </SubSection>

      <SubSection title="Estado de erro">
        <div className="max-w-xl">
          <ErrorMessage message="Não foi possível buscar os cursos. Tente novamente." />
        </div>
      </SubSection>
    </Section>
  )
}
