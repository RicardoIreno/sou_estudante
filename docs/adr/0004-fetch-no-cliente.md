# 0004. Busca de dados no cliente (front)

**Status:** Rascunho

## Decisão

As páginas de busca e de perfil buscam dados no navegador (hooks com
`useEffect` em `src/services/api`), passando pelo proxy `/api` do Next.js. As
rotas `[id]` são Server Components que apenas repassam o `id` a um loader
cliente.

## Motivo

*A preencher pelo time.*

## Consequências (observadas no código)

- Sem dados no HTML inicial e sem `generateMetadata` por curso ou IES: sem SEO
  por página de detalhe.
- O cache `next: { revalidate }` do cliente HTTP não tem efeito no navegador.
- Cada componente que usa `useSearchCursos()` dispara a própria requisição
  (ver seção 15 de [analise-sonnet.md](../analise-sonnet.md)).
