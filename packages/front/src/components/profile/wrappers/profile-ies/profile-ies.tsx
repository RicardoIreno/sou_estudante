import { MapPin } from 'lucide-react'
import { Profile } from '@/components/profile'
import { Route } from '@/components/ui/route/route'
import { Tag } from '@/components/ui/tag/tag'
import { MODULE_META, type Module } from '@/lib/module'
import type { IES } from '@/services/api/types'

interface ProfileIESProps {
  ies: IES
  module?: Module
}

/**
 * Wrapper da IES sobre o núcleo agnóstico `Profile`: preenche os dados
 * cadastrais da instituição.
 */
export const ProfileIES = ({ ies, module = '4' }: ProfileIESProps) => {
  const nome = ies.no_ies ?? 'Instituição não especificada'
  const titulo = ies.sg_ies || nome
  const subtitulo = ies.sg_ies ? nome : undefined

  const organizacao = ies.organizacao_academica?.no_organizacao_academica
  const categoria = ies.categoria_administrativa?.no_categoria_administrativa

  const descritores = [organizacao, categoria].filter(Boolean).join(' · ')

  const tags = [organizacao, categoria].filter(Boolean) as string[]

  const municipio = ies.localizacao?.no_municipio
  const uf = ies.localizacao?.sg_uf
  const regiao = ies.localizacao?.no_regiao
    ? `Região ${ies.localizacao.no_regiao}`
    : undefined

  return (
    <Profile module={module}>
      <Profile.Header
        badge={MODULE_META[module].badge}
        title={titulo}
        subtitle={subtitulo}
      >
        {descritores && (
          <p className="font-sans text-base font-semibold text-fg">
            {descritores}
          </p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} module={module} className="mr-0" />
            ))}
          </div>
        )}
      </Profile.Header>

      {municipio && (
        <Profile.Location
          icon={<MapPin className="size-6" />}
          eyebrow="Localização"
          value={municipio}
          source={regiao}
          tag={uf}
        />
      )}

      <Profile.Section title="Continue sua rota" className="mt-4">
        <Route
          module="5"
          variant="inline"
          title="Comparar cursos entre instituições"
          description="Lado a lado pelos mesmos indicadores — Sextante"
        />
        <Route module="1" variant="inline" />
      </Profile.Section>
    </Profile>
  )
}
