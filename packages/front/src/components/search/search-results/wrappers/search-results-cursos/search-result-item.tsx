import { ArrowRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { MaskEnade } from '@/components/enade/mask-enade/mask-enade'
import { TagEnade } from '@/components/enade/tag-enade/tag-enade'
import { Card, type CardTag } from '@/components/ui/card'
import { parseEnadeLevel } from '@/lib/enade'
import type { Module } from '@/lib/module'
import type { Curso } from '@/services/api/types'

interface SearchResultItemProps {
  curso: Curso
  module?: Module
}

export function SearchResultItem({ curso, module }: SearchResultItemProps) {
  // Extrair dados da estrutura completa
  const nomeCurso = curso.curso?.no_curso || 'Curso não especificado'
  const instituicao = curso.instituicao?.no_ies || ''
  const modalidade = curso.curso?.no_modalidade_ensino || ''
  const municipio = curso.localizacao?.no_municipio || ''
  const uf = curso.localizacao?.sg_uf || ''

  // Dados de qualidade
  const conceitoEnade = parseEnadeLevel(curso.enade?.conceito_faixa_enade)
  const taxaDesistencia = curso.tda?.tda

  // Dados do SISU (primeira oferta do curso)
  const temSisu = curso.sisu?.tem_sisu ?? false
  const oferta = curso.sisu?.ofertas?.[0]
  const turno = oferta?.turno || ''
  const gratuito = curso.curso?.in_gratuito

  const idCurso = curso.curso?.co_curso || ''

  // Localização
  const localizacaoItens = [municipio, uf].filter(Boolean)
  const localizacaoCompleta = localizacaoItens.join(' - ')
  const localizacaoTag = localizacaoItens.join(', ')

  // Vagas (Censo)
  const totalVagas = curso.censo_metricas?.qt_vg_total
  const vagasTag =
    typeof totalVagas === 'number'
      ? `${totalVagas} ${totalVagas === 1 ? 'vaga' : 'vagas'}`
      : undefined

  // Montar tags dinâmicas
  const tags: Array<string | CardTag | ReactElement> = []
  if (gratuito) tags.push('Gratuito')
  if (modalidade) tags.push(modalidade)
  if (turno) tags.push(turno)
  if (temSisu) tags.push('Tem Sisu')
  if (localizacaoTag) {
    tags.push({
      label: localizacaoTag,
      icon: <MapPin aria-hidden className="size-3" />,
      source: 'Censo',
      tone: 'accent',
    })
  }
  if (vagasTag) {
    tags.push({ label: vagasTag, source: 'Censo', tone: 'neutral' })
  }
  tags.push(<TagEnade key="enade" level={conceitoEnade} />)

  const card = (
    <Card module={module}>
      <Card.Backdrop>
        <MaskEnade level={conceitoEnade} />
      </Card.Backdrop>
      <Card.Header>
        <Card.Title
          level={3}
          title={`${nomeCurso} • ${idCurso}`}
          subtitle={`${instituicao} • ${localizacaoCompleta}`}
        />
      </Card.Header>
      <hr className="border-t-[1px] border-plum-100 my-3 relative -z-20" />

      {tags.length > 0 && <Card.Tags source={tags} />}

      <hr className="border-t-[1px] border-plum-100 my-3 relative -z-20" />
      <Card.ProgressBar
        title="Taxa de desistência acumulada (5 anos)"
        percentage={
          typeof taxaDesistencia === 'number'
            ? `${Math.round(taxaDesistencia)}%`
            : undefined
        }
        emptyHint="sem dados"
      />
    </Card>
  )

  const id = curso.sequencial
  if (id === undefined) {
    return card
  }

  return (
    <div className="space-y-2" data-module={module}>
      <Link
        href={`/cursos/${id}`}
        aria-label={`Ver detalhes do curso ${nomeCurso}`}
        className="block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
      >
        {card}
      </Link>

      {temSisu && (
        <Link
          href={`/ingresso/${id}`}
          aria-label={`Ver ingresso via Sisu de ${nomeCurso}`}
          className="inline-flex items-center gap-1 rounded-full px-1 font-sans text-xs font-bold text-accent-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
        >
          Ver ingresso via Sisu
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
