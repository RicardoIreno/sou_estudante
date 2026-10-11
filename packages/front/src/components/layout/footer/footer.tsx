import { cn } from '@/utils/cn'

interface FooterProps {
  className?: string
}

export const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn('flex justify-center px-5 py-3.5', className)}>
      <p
        className={cn(
          'inline-block',
          'text-xs leading-[1.6] text-footer-text',
          'bg-footer-background rounded-2xl m-3 p-2',
        )}
      >
        Um produto do <strong>SoU_Ciência · Unifesp</strong> · Dados públicos ·{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/deed.pt-br"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Licença Creative Commons BY 4.0
        </a>{' '}
        · Censo da Educação Superior (INEP) · e-MEC · Sisu
      </p>
    </footer>
  )
}
