'use client'

import { Info } from 'lucide-react'
import { Callout } from '@/components/ui/callout'
import type { Curso } from '@/services/api/types'
import { useCurso } from '@/services/api/use-curso'
import { ProfileLoader } from '../../profile-loader'
import { ProfileIngresso } from './profile-ingresso'

interface ProfileIngressoLoaderProps {
  id: string
  initialData?: Curso
}

export const ProfileIngressoLoader = ({
  id,
  initialData,
}: ProfileIngressoLoaderProps) => {
  const { curso, isLoading, error, notFound } = useCurso(id, initialData)
  const semSisu = curso != null && !curso.sisu?.tem_sisu
  const nomeIes = curso?.instituicao?.no_ies

  return (
    <ProfileLoader
      data={curso}
      isLoading={isLoading}
      error={error}
      notFound={notFound || semSisu}
      notFoundTitle="Oferta não encontrada"
      notFoundDescription="O endereço aponta para uma oferta que não existe nesta edição dos dados. O link pode estar desatualizado ou incompleto."
      notFoundContent={
        semSisu ? (
          <Callout v="blue">
            <Callout.Header>
              <Callout.Icon>
                <Info aria-hidden="true" />
              </Callout.Icon>
              <Callout.HeaderContent>
                <Callout.Tagline>Para você, estudante</Callout.Tagline>
                <Callout.Title>
                  O curso não possui ingresso por Sisu
                </Callout.Title>
              </Callout.HeaderContent>
            </Callout.Header>
            <Callout.Content>
              <p>
                Esta oferta não participa do Sisu. Isso não significa que não dá
                para entrar: a instituição pode selecionar estudantes por
                vestibular próprio, Enem direto, histórico escolar ou outro
                processo seletivo.
              </p>
              <p>
                Para saber como ingressar, consulte o site da instituição
                {nomeIes ? (
                  <>
                    {' '}
                    — <strong>{nomeIes}</strong>
                  </>
                ) : null}
                . Lá estão as informações oficiais e atualizadas sobre o
                processo seletivo.
              </p>
            </Callout.Content>
          </Callout>
        ) : undefined
      }
      fallbackError="Não foi possível carregar esta oferta."
      backHref="/cursos"
    >
      {(data) => <ProfileIngresso curso={data} />}
    </ProfileLoader>
  )
}
