import { Tag } from "@/components/ui/tag/tag"
import { ArrowRight, Info } from "lucide-react"
import Link from "next/link";

interface ProfilePermanenciaFinancingProps {
    tipo: 'prouni' | 'fies' | 'cotas',
    valor: number,
    ingressantes: number,
    integrais?: number,
    parciais?: number,
    descricao: string,
}

export const ProfilePermanenciaFinancing = ({tipo, valor, ingressantes, integrais, parciais, descricao}: ProfilePermanenciaFinancingProps) => {
    const porcentagem = Math.round((valor / ingressantes) * 100);
    const larguraBarra = Math.min(100, (valor / ingressantes) * 100);
    const corProuni = '#2ECC8A';
    const corFies = '#FFA000'
    
    if (tipo === 'prouni') {

        return (
            <div className="mb-3 rounded-card border border-plum-100 bg-surface p-[1.125rem]">
                <div className="mb-[0.625rem] flex items-start justify-between gap-3">
                    <p className="text-protagonist-sm font-bold text-text">ProUni</p>
                    <Tag
                        label={'INTEGRAL OU PARCIAL'}
                        module={'3'}
                        className="border-none bg-enade-ok-surface font-bold text-enade-ok/85 py-[2px]"
                    />
                </div>

                {valor === 0 ? 
                    <div className="mb-[0.375rem] text-protagonist-sm font-semibold text-text-muted">
                        Nenhum beneficiário registrado em 2024
                    </div> 
                :
                    <>
                        <div className="mb-2 font-mono text-protagonist-lg font-bold leading-none text-text">
                            {valor}{" "}
                            <small className="font-coadjuvant text-coadjuvant-sm font-medium text-text-muted">
                                de {ingressantes} ingressantes · {porcentagem}%
                            </small>
                        </div>
                        <div className="mb-2 text-coadjuvant-xs text-text-muted">
                            {integrais} integrais · {parciais} parciais
                        </div>
                        <div className="mb-2 h-[9px] overflow-hidden rounded-[5px] bg-plum-100">
                            <div
                                className="h-full rounded-[5px]"
                                style={{
                                    width: `${larguraBarra}%`,
                                    background: `${corProuni}`,
                                }} />
                        </div>
                    </>
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

    if (tipo === 'fies') {

        return (
            <div className="mb-3 rounded-card border border-plum-100 bg-surface p-[1.125rem]">
                <div className="mb-[0.625rem] flex items-start justify-between gap-3">
                    <p className="text-protagonist-sm font-bold text-text">Fies</p>
                    <Tag
                        label={'REEMBOLSÁVEL · COM JUROS'}
                        module={'3'}
                        className="border-none bg-enade-warn-surface font-bold text-enade-warn/85 py-[2px]"
                    />
                </div>

                {valor === 0 ? 
                    <div className="mb-[0.375rem] text-protagonist-sm font-semibold text-text-muted">
                        Nenhum beneficiário registrado em 2024
                    </div> 
                    :
                    <>
                        <div className="mb-2 font-mono text-protagonist-lg font-bold leading-none text-text">
                            {valor}{" "}
                            <small className="font-coadjuvant text-coadjuvant-sm font-medium text-text-muted">
                                de {ingressantes} ingressantes · {porcentagem}%
                            </small>
                        </div>
                        <div className="mb-2 h-[9px] overflow-hidden rounded-[5px] bg-plum-100">
                                <div
                                    className="h-full rounded-[5px]"
                                    style={{
                                        width: `${larguraBarra}%`,
                                        background: `${corFies}`,
                                    }} />
                        </div>
                    </>
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

    return (
        <div className="mb-3 rounded-card border border-plum-100 bg-surface p-[1.125rem]">
            <div className="mb-[0.625rem] flex items-start justify-between gap-3">
                <p className="text-protagonist-sm font-bold text-text">Cotas · reserva de vagas</p>
                <Tag
                    label={'RESERVA DE VAGAS'}
                    module={'3'}
                    className="border-none bg-accent/20 font-bold text-accent-deep/80 py-[2px]"
                />
            </div>

            {valor === 0 ? 
                <div className="mb-[0.375rem] text-protagonist-sm font-semibold text-text-muted">
                    Nenhum beneficiário registrado em 2024
                </div>
                :
                <>
                    <div className="mb-2 font-mono text-protagonist-lg font-bold leading-none text-text">
                        {valor}{" "}
                        <small className="font-coadjuvant text-coadjuvant-sm font-medium text-text-muted">
                            de {ingressantes} ingressantes · {porcentagem}%
                        </small>
                    </div>
                    <div className="mb-2 h-[9px] overflow-hidden rounded-[5px] bg-plum-100">
                            <div
                                className="h-full rounded-[5px] bg-accent"
                                style={{
                                    width: `${larguraBarra}%`,
                                }} />
                    </div>
                </>
            }

            <p className="mb-1 text-coadjuvant-sm leading-[1.55] text-text-muted">
                {descricao}
            </p>
            <div className="mt-2 flex items-center gap-[6px] text-coadjuvant-xs text-text-muted">
                <Info className="size-3"/>
                Censo · 2024
            </div>

            <Link href={"https://souciencia.unifesp.br/painel-de-cotas"} className="mt-[0.625rem] flex items-center gap-1 text-coadjuvant-sm font-semibold text-accent-deep">
                Ver tipos no Painel de Cotas
                <ArrowRight className="size-3"/>
            </Link>

            <Link href={"https://souciencia.unifesp.br/cartilha-cotas"} className="mt-[0.625rem] flex items-center gap-1 text-coadjuvant-sm font-semibold text-accent-deep">
                Entenda as cotas na Cartilha
                <ArrowRight className="size-3"/>
            </Link>
        </div>
    )

}