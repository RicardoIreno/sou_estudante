import { ProfilePermanenciaLoader } from "@/components/profile/wrappers/profile-permanencia/profile-permanencia-loader"

interface PermanenciaDetalhePageProps {
    params: Promise<{ id: string }>
}

export default async function PermanenciaDetalhePage({
    params,
}: PermanenciaDetalhePageProps) {
    const { id } = await params

    return (
        <div className="min-h-screen w-full bg-card-surface">
            <ProfilePermanenciaLoader id={id} />
        </div>
    )
}