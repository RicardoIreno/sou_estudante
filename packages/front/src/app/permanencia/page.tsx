import { LayoutSearchPage } from '@/components/layout/layout-search-page'
import { Callout } from '@/components/ui/callout'
import { IconModule } from '@/components/ui/icon-module/icon-module'

export default function PermanenciaPage() {
  return (
    <LayoutSearchPage
      module="3"
      notice={
        <Callout v="module">
          <Callout.Header>
            <Callout.Icon>
              <IconModule module="3" />
            </Callout.Icon>
            <Callout.HeaderContent>
              <Callout.Tagline>Para você, estudante</Callout.Tagline>
              <Callout.Title>
                Permanecer também <em>faz parte da rota.</em>
              </Callout.Title>
            </Callout.HeaderContent>
          </Callout.Header>
          <Callout.Content>
            <p>
              Muita gente entra na universidade e não consegue ficar — por falta
              de moradia, transporte, ou de uma bolsa que faça a conta fechar.
              Esses apoios existem, e os números mostram quem já alcançou cada
              um.
            </p>
            <p>
              Os dados são proporcionais. Bolsas e cotas mostram quantos, entre
              os ingressantes daquele ano, foram beneficiados; os apoios de
              permanência tomam os matriculados como referência. Onde aparece
              zero, significa que não houve beneficiário registrado — e isso
              também é informação.
            </p>
          </Callout.Content>
          <Callout.Footer>
            — SoU_Estudante · SoU_Ciência / Unifesp · Censo da Educação Superior
          </Callout.Footer>
        </Callout>
      }
    />
  )
}
