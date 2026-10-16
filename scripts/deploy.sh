#!/usr/bin/env bash
# Publica a versão sincronizada nesta pasta (executado NO SERVIDOR).
#
# Chamado pelo workflow .github/workflows/deploy.yml, via SSH, logo depois do
# rsync do código. Pode ser rodado à mão na pasta de deploy:
#
#   IMAGE_TAG=<sha> scripts/deploy.sh
#
# Etapas: valida o .env, detecta o compose, constrói as imagens, sobe os
# serviços, remove imagens órfãs e verifica a saúde (Elasticsearch, API, front).
# Variáveis opcionais: IMAGE_TAG (padrão latest), COMPOSE_FILE.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
export IMAGE_TAG="${IMAGE_TAG:-latest}"

die() { printf 'ERRO: %s\n' "$*" >&2; exit 1; }
step() { printf '==> %s\n' "$*"; }

cd "$ROOT"

[ -f .env ] || die ".env não encontrado em $ROOT (crie a partir de .env.example)"

step "Validando variáveis essenciais do .env"
missing=0
for var in ELASTIC_PASSWORD ELASTICSEARCH_APIKEY; do
  # `|| true`: variável ausente devolve vazio em vez de abortar (set -e + pipefail).
  value="$(grep -E "^[[:space:]]*${var}=" .env | tail -n1 | cut -d= -f2- \
    | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//' || true)"
  if [ -z "$value" ]; then
    printf 'ERRO: variável %s vazia ou ausente no .env\n' "$var" >&2
    missing=1
  fi
done
[ "$missing" -eq 0 ] || exit 1

step "Detectando o comando de compose"
if command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then
  COMPOSE_CMD=(podman compose)
elif command -v podman-compose >/dev/null 2>&1; then
  COMPOSE_CMD=(podman-compose)
elif command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD=(docker-compose)
else
  die "nenhum compose encontrado (podman compose, podman-compose, docker compose, docker-compose)"
fi
echo "Usando: ${COMPOSE_CMD[*]}"

compose() { "${COMPOSE_CMD[@]}" -f "$COMPOSE_FILE" --env-file .env "$@"; }

step "Construindo imagens de produção (IMAGE_TAG=$IMAGE_TAG)"
compose build --pull

step "Subindo serviços"
compose up -d --remove-orphans

step "Removendo imagens órfãs"
case "${COMPOSE_CMD[0]}" in
  podman*) podman image prune -f >/dev/null 2>&1 || true ;;
  docker*) docker image prune -f >/dev/null 2>&1 || true ;;
esac

# Aguarda até ~60 s (30 tentativas, 2 s). Os códigos aceitos vão em $3.
wait_http() {
  local name="$1" url="$2" accepted="$3" code
  for _ in $(seq 1 30); do
    code="$(curl -s -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || true)"
    if [[ " $accepted " == *" $code "* ]]; then
      echo "$name OK (HTTP $code)"
      return 0
    fi
    sleep 2
  done
  die "$name não respondeu em $url"
}

step "Verificando a saúde dos serviços"
# 401 indica que o Elasticsearch está no ar (a autenticação está habilitada).
wait_http "Elasticsearch" "http://localhost:9200/" "200 401"
wait_http "API" "http://localhost:8080/healthz" "200"
wait_http "Frontend" "http://localhost:3000/" "200"

step "Status dos containers"
compose ps

step "Deploy concluído com sucesso"