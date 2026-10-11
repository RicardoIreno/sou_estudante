import type { Metadata } from 'next'
import { DM_Mono, Source_Sans_3 } from 'next/font/google'
import { WavesShape } from '@/assets/waves'
import { Footer } from '@/components/layout/footer/footer'
import { LayoutSite } from '@/components/layout/layout-site'
import { cn } from '@/utils/cn'
import { Providers } from './providers'
import './globals.css'

const sourceSans = Source_Sans_3({
  variable: '--font-sans',
  subsets: ['latin'],
  style: ['normal', 'italic'],
})

const dmMono = DM_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'SoU_Estudante',
  description:
    'Plataforma de dados públicos do ensino superior para estudantes de primeira geração — SoU_Ciência (Unifesp).',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={cn(
          'bg-site-background relative antialiased',
          sourceSans.variable,
          dmMono.variable,
        )}
      >
        <Providers>
          <LayoutSite className="z-10">{children}</LayoutSite>
          <Footer className="z-10" />
          <WavesShape className="fixed bottom-0 -z-10" />
        </Providers>
      </body>
    </html>
  )
}
