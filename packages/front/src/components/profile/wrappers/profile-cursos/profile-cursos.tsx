import { MapPin } from 'lucide-react'
import { Menu } from '@/components/layout/menu/menu'
import { Profile } from '@/components/profile'
import { Route } from '@/components/ui/route/route'
import { Tag } from '@/components/ui/tag/tag'
import { MODULE_META, type Module } from '@/lib/module'
import type { Curso } from '@/services/api/types'
import { buildOverviewItems } from './profile-cursos-overview-items'
import { ProfileCursosQuality } from './profile-cursos-quality'

interface ProfileCursosProps {
  curso: Curso
  module?: Module
}

/**
 * Wrapper do curso sobre o núcleo agnóstico `Profile`: preenche os detalhes
 * específicos de curso (visão geral, qualidade e próximos passos).
 */
export const ProfileCursos = ({ curso, module = '1' }: ProfileCursosProps) => {
  const nomeCurso = curso.curso?.no_curso ?? 'Curso não especificado'
  const grau = curso.curso?.no_grau_academico
  const titulo = grau ? `${nomeCurso} — ${grau}` : nomeCurso
  const subtitulo =
    curso.instituicao?.sg_ies || curso.instituicao?.no_ies || undefined
  const cidade = curso.localizacao?.no_municipio
  const uf = curso.localizacao?.sg_uf
  const temSisu = curso.sisu?.tem_sisu ?? false
  const id = curso.sequencial
  const ingressoHref =
    temSisu && id !== undefined ? `/ingresso/${id}` : undefined

  return (
    <Profile module={module}>
      <Profile.TopBar backLabel="Resultados" backHref="/cursos">
        <div className="flex items-center gap-2">
          <Tag
            label={'Escolher curso'}
            module={'1'}
            className="font-semibold px-[10px] py-[3px] tracking-[0.5px] mr-0"
          />
          <Menu />
        </div>
      </Profile.TopBar>

      <Profile.Header
        badge={MODULE_META[module].badge}
        title={titulo}
        subtitle={subtitulo}
      >
        {temSisu && (
          <Tag label={'Tem Sisu'} module={'2'} className="py-[2px]" />
        )}
      </Profile.Header>

      {cidade && (
        <Profile.Location
          icon={<MapPin className="size-4" />}
          eyebrow="Local de oferta"
          value={cidade}
          source="Censo da Educação Superior"
          tag={uf}
          module="2"
        />
      )}

      <Profile.Tabs defaultValue="overview">
        <Profile.TabList>
          <Profile.Tab value="overview">Visão geral</Profile.Tab>
          <Profile.Tab value="quality">Qualidade</Profile.Tab>
        </Profile.TabList>

        <Profile.TabPanel value="overview">
          <div className="p-4">
            <Profile.Overview items={buildOverviewItems(curso)} />
          </div>
        </Profile.TabPanel>

        <Profile.TabPanel value="quality">
          <ProfileCursosQuality curso={curso} module={module} />
        </Profile.TabPanel>
      </Profile.Tabs>

      <Profile.Section title="Continue sua rota" className="mt-1">
        {ingressoHref && (
          <Route
            module="2"
            variant="inline"
            href={ingressoHref}
            title="Como ingressar neste curso"
            description="Notas de corte, vagas e cotas no Sisu — Bússola"
          />
        )}
        <Route
          module="3"
          variant="inline"
          title="Vou conseguir me manter?"
          description="Bolsas, cotas e apoios à permanência — Âncora"
        />
        <Route
          module="4"
          variant="inline"
          title="Conheça a instituição"
          description="Indicadores oficiais e perfil da IES — Telescópio"
        />
      </Profile.Section>
    </Profile>
  )
}
