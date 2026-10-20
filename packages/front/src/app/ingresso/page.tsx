import { Info } from 'lucide-react'
import { LayoutSearchPage } from '@/components/layout/layout-search-page'
import { Callout } from '@/components/ui/callout'

export default function IngressoPage() {
  return (
    <LayoutSearchPage
      module="2"
      notice={
        <>
          <Callout v="module">
            <Callout.Header>
              <Callout.Icon>
                <Info aria-hidden="true" />
              </Callout.Icon>
              <Callout.HeaderContent>
                <Callout.Tagline>Sisu</Callout.Tagline>
                <Callout.Title>O que é o Sisu?</Callout.Title>
              </Callout.HeaderContent>
            </Callout.Header>
            <Callout.Content>
              <p>
                O Sistema de Seleção Unificada (Sisu) é a plataforma do MEC que
                usa a nota do Enem para distribuir vagas em universidades
                públicas. Você se inscreve, escolhe cursos e concorre pela sua
                nota — sem prestar um vestibular próprio.
              </p>
              <p>
                A <strong>nota de corte</strong> é a nota do último candidato
                classificado em cada modalidade.
              </p>
              <p>
                <strong>
                  A nota de corte que você vê aqui é da plataforma Sisu e vale
                  para a primeira chamada.
                </strong>{' '}
                As universidades fazem várias chamadas e esta nota tende a cair
                — portanto, fique atento! Os dados são da edição 2026.
              </p>
              <p>
                Mostramos o ingresso pelo Sisu porque é a via adotada pela
                maioria das universidades públicas. Instituições com vestibular
                próprio: consulte o site da IES.
              </p>
            </Callout.Content>
          </Callout>

          <Callout v="blue" className="mt-3">
            <Callout.Header>
              <Callout.Icon>
                <Info aria-hidden="true" />
              </Callout.Icon>
              <Callout.HeaderContent>
                <Callout.Tagline>Para você, estudante</Callout.Tagline>
                <Callout.Title>
                  A nota de corte é <i>um ponto de partida</i>
                </Callout.Title>
              </Callout.HeaderContent>
            </Callout.Header>
            <Callout.Content>
              <p>
                Os dados que você vai encontrar aqui são reais — mas pertencem
                ao passado. A cada nova edição do Sisu, as notas mudam. A lista
                de espera já garantiu vagas para pessoas que achavam que não
                tinham chance.
              </p>
              <p>
                E atenção aos prazos: cada chamada tem datas de inscrição e
                matrícula definidas em edital. Perder um prazo pode significar
                perder a vaga — acompanhe o processo inteiro, até os resultados
                finais.
              </p>
            </Callout.Content>
            <Callout.Footer>
              — SoU_Estudante · SoU_Ciência / Unifesp · Sisu
            </Callout.Footer>
          </Callout>
        </>
      }
    />
  )
}
