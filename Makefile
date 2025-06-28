.DEFAULT_GOAL := help
.PHONY: help setup install build base-image dev prod test lint format type-check logs stop restart rebuild-cache clean
export DOCKER_BUILDKIT=true
export COMPOSE_DOCKER_CLI_BUILD=true
export COMPOSE_BAKE=true
export NODE_MAJOR ?= $(shell cut -d. -f1 .node-version)

BASE_TAG = lixit/base-deps:$(NODE_MAJOR)
CACHE_DIR = .buildx-cache
DOCKERFILE_BASE = dockerfiles/Dockerfile.base
BUILDER_NAME = lixit_builder_$(NODE_MAJOR)

$(CACHE_DIR):
	mkdir -p $(CACHE_DIR)

builder:
	@if ! docker buildx inspect $(BUILDER_NAME) >/dev/null 2>&1 ; then \
		docker buildx create --name $(BUILDER_NAME) --driver docker-container --use ; \
	else \
		docker buildx use $(BUILDER_NAME) ; \
	fi

base-image: builder | $(CACHE_DIR)
	docker buildx build \
		--builder $(BUILDER_NAME) \
		--load \
		--compress \
		--progress=plain \
		--cache-from=type=local,src=$(CACHE_DIR) \
		--cache-to=type=local,dest=$(CACHE_DIR),mode=max \
		--build-arg NODE_MAJOR=$(NODE_MAJOR) \
		-f $(DOCKERFILE_BASE) \
		-t $(BASE_TAG) .
	@echo "✅ built $(BASE_TAG)"

dev: base-image
	@NODE_MAJOR=$(NODE_MAJOR) docker compose --progress=plain --profile dev build
	@NODE_MAJOR=$(NODE_MAJOR) docker compose --progress=plain --profile --remove-orphans dev up -d

prod: base-image
	@NODE_MAJOR=$(NODE_MAJOR) docker compose --progress=plain --profile prod build
	@NODE_MAJOR=$(NODE_MAJOR) docker compose --progress=plain --profile --remove-orphans prod up -d

rebuild-cache:
	rm -rf $(CACHE_DIR)
	$(MAKE) base-image

clean:
	docker compose down -v
	docker image prune -af
	docker builder prune -af
	rm -rf $(CACHE_DIR)
	npm run clean

help:
	@echo "make setup – Initial project setup"
	@echo "make install – npm ci for all workspaces"
	@echo "make build – npm run build (monorepo)"
	@echo "make dev – Build & start full dev stack"
	@echo "make prod – Build & start prod-like stack"
	@echo "make test – Run all tests"
	@echo "make lint – ESLint across workspace"
	@echo "make format – Prettier formatting"
	@echo "make type-check – TypeScript checks"
	@echo "make logs – Tail docker-compose logs"
	@echo "make stop – Stop all services"
	@echo "make restart – Restart all services"
	@echo "make rebuild-cache – Rebuild base image (no cache)"
	@echo "make clean – Remove containers, images, cache"

setup: ; ./scripts/setup.sh
install: ; npm ci --verbose
build: ; npm run build
test: ; npm test
lint: ; npm run lint
format: ; npm run format
type-check: ; npm run type-check

logs: ; docker compose logs -f
stop: ; docker compose down
restart: ; docker compose restart
