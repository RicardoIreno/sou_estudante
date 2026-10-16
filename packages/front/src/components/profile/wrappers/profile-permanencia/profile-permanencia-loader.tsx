'use client'

import { useCurso } from '@/services/api/use-curso'
import { ProfileLoader } from '../../profile-loader'
import { ProfilePermanencia } from './profile-permanencia'

interface ProfilePermanenciaLoaderProps {
  id: string
}

export const ProfilePermanenciaLoader = ({
  id,
}: ProfilePermanenciaLoaderProps) => {
  const { curso, isLoading, error, notFound } = useCurso(id)

  return (
    <ProfileLoader
      data={curso}
      isLoading={isLoading}
      error={error}
      notFound={notFound}
      notFoundTitle="Curso não encontrado"
      notFoundDescription="O curso que você procura não existe ou foi removido."
      fallbackError="Não foi possível carregar o curso."
      backHref="/cursos"
    >
      {(data) => <ProfilePermanencia curso={data} />}
    </ProfileLoader>
  )
}
