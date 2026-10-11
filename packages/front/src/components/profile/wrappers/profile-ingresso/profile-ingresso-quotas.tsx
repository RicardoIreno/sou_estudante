import { cn } from '@/utils/cn'

interface ProfileIngressoQuotasProps {
  nome: string | undefined
  descricao?: string | undefined
  vagas: number | undefined
  nota: number | undefined
}

const formatNotaCorte = (value: number) =>
  `${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`

export const ProfileIngressoQuotas = ({
  nome,
  descricao,
  vagas,
  nota,
}: ProfileIngressoQuotasProps) => {
  const vazia = nota === null || nota === undefined

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 rounded-panel border p-3',
        vazia
          ? 'border-dashed border-plum-100 bg-site-background'
          : 'border-plum-100 bg-surface',
      )}
    >
      <div>
        <div className="mb-px text-xs font-bold text-fg">{nome}</div>
        {descricao && <div className="text-xs text-fg-muted">{descricao}</div>}
      </div>

      <div className="text-right">
        <span className="font-mono text-base font-bold text-fg">
          {nota ? formatNotaCorte(nota) : '—'}
        </span>

        {!vazia && typeof vagas === 'number' && (
          <div className="font-mono text-xs text-fg-muted">
            {vagas} {vagas === 1 ? 'vaga' : 'vagas'}
          </div>
        )}
      </div>
    </div>
  )
}
