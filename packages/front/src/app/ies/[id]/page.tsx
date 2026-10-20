import type { Metadata } from 'next'
import { ProfileIESLoader } from '@/components/profile/wrappers/profile-ies/profile-ies-loader'
import { API_CONFIG } from '@/services/api'
import { serverFetch } from '@/services/api/server'
import type { IES } from '@/services/api/types'

interface IesDetalhePageProps {
  params: Promise<{ id: string }>
}

async function getIes(id: string): Promise<IES | undefined> {
  const result = await serverFetch<IES>(API_CONFIG.ENDPOINTS.DETAIL_IES(id))
  return result.success ? result.data : undefined
}

export async function generateMetadata({
  params,
}: IesDetalhePageProps): Promise<Metadata> {
  const { id } = await params
  const ies = await getIes(id)
  const nome = ies?.no_ies

  if (!nome) {
    return { title: 'Instituição não encontrada | SoU_Estudante' }
  }

  const local = [
    ies?.localizacao?.sg_uf,
    ies?.categoria_administrativa?.no_categoria_administrativa,
  ]
    .filter(Boolean)
    .join(' · ')

  return {
    title: `${nome} | SoU_Estudante`,
    description: local
      ? `Dados da instituição ${nome} (${local}).`
      : `Dados da instituição ${nome} no ensino superior.`,
  }
}

export default async function IesDetalhePage({ params }: IesDetalhePageProps) {
  const { id } = await params
  const ies = await getIes(id)

  return (
    <div className="min-h-screen w-full bg-surface-lv2">
      <ProfileIESLoader id={id} initialData={ies} />
    </div>
  )
}
