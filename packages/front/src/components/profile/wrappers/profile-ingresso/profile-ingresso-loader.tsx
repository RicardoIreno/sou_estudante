'use client'

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

  return (
    <ProfileLoader
      data={curso}
      isLoading={isLoading}
      error={error}
      notFound={notFound || semSisu}
      notFoundTitle={
        semSisu
          ? 'O curso não possui ingresso por Sisu'
          : 'Oferta não encontrada'
      }
      notFoundDescription={
        semSisu
          ? 'O endereço aponta para uma oferta que não possui ingresso por meio do Sisu.'
          : 'O endereço aponta para uma oferta que não existe nesta edição dos dados. O link pode estar desatualizado ou incompleto.'
      }
      fallbackError="Não foi possível carregar esta oferta."
      backHref="/cursos"
    >
      {(data) => <ProfileIngresso curso={data} />}
    </ProfileLoader>
  )
}
