.PHONY: help setup install build base-image start prod test lint format type-check logs stop clean docker-config reset
.DEFAULT_GOAL := help

export COMPOSE_DOCKER_CLI_BUILD=1
export COMPOSE_BAKE=1
export NODE_MAJOR ?= $(shell cut -d. -f1 .node-version)

help:
	@echo "make setup      - Initial project setup"
	@echo "make install    - pnpm ci for all workspaces"
	@echo "make build      - pnpm run build (monorepo)"
	@echo "make start      - Build & start full dev stack"
	@echo "make prod       - Build & start prod-like stack"
	@echo "make test       - Run all tests"
	@echo "make lint       - ESLint across workspace"
	@echo "make format     - Prettier formatting"
	@echo "make type-check - TypeScript checks"
	@echo "make logs       - Tail docker-compose logs"
	@echo "make stop       - Stop all services"
	@echo "make clean      - Tear down & clean images"
	@echo "make reset      - Reset everything"

setup: ; @./scripts/setup.sh
build: ; @pnpm -r --parallel build
test: ; @pnpm test
lint: ; @pnpm lint
format: ; @pnpm format
type-check: ; @pnpm type-check
logs: ; @docker compose logs -f
stop: ; @docker compose down
install: ; @if [ -d node_modules ]; then pnpm install --offline; else pnpm install --frozen-lockfile; fi
start: build base-image ; @docker compose --profile dev up -d --remove-orphans
prod: build base-image ; @docker compose --profile prod up -d --remove-orphans

docker-config:
	@if [ ! jq -e '.features.buildkit == true and .features["containerd-snapshotter"] == true and (.["registry-mirrors"] | index("http://localhost:5000"))' /etc/docker/daemon.json > /dev/null 2>&1 ]; then \
	  echo 'Docker: enable buildkit, containerd-snapshotter & registry-mirrors (caching)'; \
	  exit 1; \
	fi

base-image: docker-config
	docker buildx build \
	  --load \
	  --compress \
	  --progress=plain \
	  --cache-from=type=local,src=.buildx_cache \
	  --cache-to=type=local,dest=.buildx_cache,mode=max \
	  --build-arg NODE_MAJOR=$(NODE_MAJOR) \
	  -f dockerfiles/Dockerfile.base \
	  -t lixit/base-deps:$(NODE_MAJOR) .

clean: stop
	@pnpm clean -parallel || true
	@docker image prune -af || true
	@docker buildx prune -af || true
	@rm -rf .buildx_cache || true
	@mkdir -p .buildx_cache || true

reset: clean
	@docker system prune -a --volumes -f || true
	@git clean -xfd || true
