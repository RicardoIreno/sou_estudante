import { Tag } from "@/components/ui/tag/tag"
import { Info } from "lucide-react"

interface ProfilePermanenciaSupportProps {
    titulo: string,
    valor: number,
    matriculados: number,
    descricao: string,
}

export const ProfilePermanenciaSupport = ({titulo, valor, matriculados, descricao}: ProfilePermanenciaSupportProps) => {
    return (
        <div className="mb-3 rounded-card border border-plum-100 bg-surface p-[1.125rem]">
            <div className="mb-[0.625rem] flex items-start justify-between gap-3">
                <p className="text-protagonist-sm font-bold text-text">{titulo}</p>
                <Tag
                    label={'PERMANÊNCIA'}
                    module={'2'}
                    className="border-none bg-accent/20 font-bold text-accent-deep/80 py-[2px]"
                />
            </div>

            {valor === 0 ?
                <div className="mb-[0.375rem] text-protagonist-sm font-semibold text-text-muted">
                    Nenhum beneficiário registrado em 2024
                </div> 
                :
                <div className="mb-2 font-mono text-protagonist-lg font-bold leading-none text-text">
                    {valor}{" "}
                    <small className="font-coadjuvant text-coadjuvant-sm font-medium text-text-muted">
                        de {matriculados} matriculados
                    </small>
                </div>
            }


            <p className="mb-1 text-coadjuvant-sm leading-[1.55] text-text-muted">
                {descricao}
            </p>
            <div className="mt-2 flex items-center gap-[6px] text-coadjuvant-xs text-text-muted">
                <Info className="size-3"/>
                Censo · 2024
            </div>
        </div>
    )
}