.DEFAULT_GOAL := help

export COMPOSE_DOCKER_CLI_BUILD=1
export COMPOSE_BAKE=1
export NODE_MAJOR ?= $(shell cut -d. -f1 .node-version)

BASE_TAG        := lixit/base-deps:$(NODE_MAJOR)
CACHE_DIR       := .buildx-cache
DOCKERFILE_BASE := dockerfiles/Dockerfile.base

.PHONY: help setup install build base-image dev prod test lint format type-check logs stop clean docker-config reset

$(CACHE_DIR):
	@mkdir -p $(CACHE_DIR)

help:
	@echo "make setup      - Initial project setup"
	@echo "make install    - npm ci for all workspaces"
	@echo "make build      - npm run build (monorepo)"
	@echo "make dev        - Build & start full dev stack"
	@echo "make prod       - Build & start prod-like stack"
	@echo "make test       - Run all tests"
	@echo "make lint       - ESLint across workspace"
	@echo "make format     - Prettier formatting"
	@echo "make type-check - TypeScript checks"
	@echo "make logs       - Tail docker-compose logs"
	@echo "make stop       - Stop all services"
	@echo "make clean      - Tear down & prune images"
	@echo "make reset      - Reset everything"

setup: ; @./scripts/setup.sh
install: ; @npm ci
build: ; @npm run build
test: ; @npm test
lint: ; @npm run lint
format: ; @npm run format
type-check: ; @npm run type-check
logs: ; @docker compose logs -f
stop: ; @docker compose down

docker-config:
	@if [ ! -f /etc/docker/daemon.json ] || ! jq -e '.features.buildkit == true and .features["containerd-snapshotter"] == true and (.["registry-mirrors"] | index("http://localhost:5000"))' /etc/docker/daemon.json > /dev/null; then \
	  echo 'Docker: enable buildkit, containerd-snapshotter & registry-mirrors (caching)'; \
	  exit 1; \
	fi

base-image: docker-config | $(CACHE_DIR)
	docker buildx build \
	  --load \
	  --compress \
	  --progress=plain \
	  --cache-from=type=local,src=$(CACHE_DIR) \
	  --cache-to=type=local,dest=$(CACHE_DIR),mode=max \
	  --build-arg NODE_MAJOR=$(NODE_MAJOR) \
	  -f $(DOCKERFILE_BASE) \
	  -t $(BASE_TAG) .

dev: build base-image ; docker compose --profile dev up -d --remove-orphans

prod: build base-image ; @docker compose --profile prod up -d --remove-orphans

clean: stop
	@npm run clean || true
	@docker image prune -af || true
	@docker buildx prune -af || true
	@rm -rf $(CACHE_DIR) || true

reset: clean
	@docker system prune -a --volumes -f || true
	@git clean -xfd || true
