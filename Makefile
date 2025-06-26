.PHONY: help dev prod test clean lint setup install build

NODE_MAJOR ?= $(shell cut -d. -f1 .node-version)

help:
	@echo "make setup      - Initial project setup (install deps, generate certs)"
	@echo "make install    - Install dependencies"
	@echo "make build      - Build all packages"
	@echo "make dev        - Start development environment"
	@echo "make prod       - Start production-like environment"
	@echo "make test       - Run all tests"
	@echo "make lint       - Run linting across all packages"
	@echo "make clean      - Clean up containers and volumes"
	@echo "make format     - Format all code"
	@echo "make type-check - Type-check all code"

setup:
	@./scripts/setup.sh

install:
	@npm install --verbose

build:
	@npm run build

dev:
	docker buildx build --load \
		--build-arg NODE_MAJOR=$(NODE_MAJOR) \
		-f dockerfiles/Dockerfile.base \
		-t lixit/base-deps:$(NODE_MAJOR) .
	@export NODE_MAJOR=$(NODE_MAJOR) ; \
	COMPOSE_BAKE=true docker compose \
		--profile dev \
		build && \
	COMPOSE_BAKE=true docker compose \
		--profile dev \
		up -d
prod:
	docker buildx build --load \
		--build-arg NODE_MAJOR=$(NODE_MAJOR) \
		-f dockerfiles/Dockerfile.base \
		-t lixit/base-deps:$(NODE_MAJOR) .
	@export NODE_MAJOR=$(NODE_MAJOR) ; \
	COMPOSE_BAKE=true docker compose \
		--profile dev \
		build && \
	COMPOSE_BAKE=true docker compose \
		--profile prod \
		up -d
test:
	@npm run test

lint:
	@npm run lint

clean:
	@docker compose down -v
	@docker image prune -a -f
	@docker system prune -f
	@npm run clean

format:
	@npm run format

type-check:
	@npm run type-check
