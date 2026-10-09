import { MapPin } from 'lucide-react'
import Link from 'next/link'
import MaskEnade from '@/components/enade/mask-enade/mask-enade'
import SeloEnade from '@/components/enade/selo-enade/selo-enade'
import { Card, type CardTag } from '@/components/ui/card'
import { parseEnadeLevel } from '@/lib/enade'
import type { Module } from '@/lib/module'
import type { Curso } from '@/services/api/types'

interface SearchResultItemProps {
  curso: Curso
  module?: Module
}

export default function SearchResultItem({
  curso,
  module,
}: SearchResultItemProps) {
  // Extrair dados da estrutura completa
  const nomeCurso = curso.curso?.no_curso || 'Curso não especificado'
  const instiuicao = curso.instituicao.no_ies || ''
  const _grauAcademico = curso.curso?.no_grau_academico || ''
  const modalidade = curso.curso?.no_modalidade_ensino || ''
  const municipio = curso.localizacao?.no_municipio || ''
  const uf = curso.localizacao?.sg_uf || ''

  // Dados de qualidade
  const conceitoEnade = parseEnadeLevel(curso.enade?.conceito_faixa_enade)
  const taxaDesistencia = curso.tda?.tda

  // Dados do SISU (primeira oferta do curso)
  const temSisu = curso.sisu
  const oferta = curso.sisu?.ofertas?.[0]
  const turno = oferta?.turno || ''
  const gratuito = curso.curso?.in_gratuito

  const idCurso = curso.curso.co_curso || ''

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
  const tags: Array<string | CardTag> = []
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

  const card = (
    <Card module={module}>
      <Card.Backdrop>
        <MaskEnade level={conceitoEnade} />
      </Card.Backdrop>
      <Card.Header>
        <SeloEnade level={conceitoEnade} size="card" />
        <Card.Title
          title={`${nomeCurso} • ${idCurso}`}
          subtitle={`${instiuicao} • ${localizacaoCompleta}`}
        />
      </Card.Header>
      {tags.length > 0 && <Card.Tags source={tags} />}
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

  const id = curso.sequencial ?? curso._id
  if (id === undefined) {
    return card
  }

  return (
    <Link
      href={`/cursos/${id}`}
      className="block rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
    >
      {card}
    </Link>
  )
}
