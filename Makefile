.DEFAULT_GOAL := help

export DOCKER_BUILDKIT ?= 1
export COMPOSE_DOCKER_CLI_BUILD ?= 1
export COMPOSE_BAKE ?= 1
export NODE_MAJOR ?= $(shell cut -d. -f1 .node-version)

.PHONY: help setup install build base-image dev prod test lint format type-check logs stop restart clean rebuild-cache

BASE_TAG = lixit/base-deps:$(NODE_MAJOR)
CACHE_DIR = .buildx-cache
DOCKERFILE_BASE = dockerfiles/Dockerfile.base

$(CACHE_DIR):
	mkdir -p $(CACHE_DIR)

help:
	@echo "make setup - Initial project setup"
	@echo "make install - Install dependencies"
	@echo "make build - Build all packages"
	@echo "make dev - Start development environment"
	@echo "make prod - Start production-like environment"
	@echo "make test - Run all tests"
	@echo "make lint - Run linting"
	@echo "make format - Format code"
	@echo "make type-check - Run type checks"
	@echo "make logs - Tail service logs"
	@echo "make stop - Stop all services"
	@echo "make restart - Restart all services"
	@echo "make clean - Remove containers, images, cache"
	@echo "make rebuild-cache - Rebuild base image from scratch"

setup:
	./scripts/setup.sh

install:
	npm ci --verbose

build:
	npm run build

base-image: | $(CACHE_DIR)
	docker buildx build --load --compress --progress=plain \
		--cache-from=type=local,src=$(CACHE_DIR) \
		--cache-to=type=local,dest=$(CACHE_DIR),mode=max \
		--build-arg NODE_MAJOR=$(NODE_MAJOR) \
		-f $(DOCKERFILE_BASE) -t $(BASE_TAG) .

dev: base-image
	docker compose --progress=plain --profile dev build
	docker compose --progress=plain --profile dev up -d

prod: base-image
	docker compose --progress=plain --profile prod build
	docker compose --progress=plain --profile prod up -d

test:
	npm run test

lint:
	npm run lint

format:
	npm run format

type-check:
	npm run type-check

logs:
	docker compose logs -f

stop:
	docker compose down

restart:
	docker compose restart

clean:
	docker compose down -v
	docker image prune -af
	docker builder prune -af
	rm -rf $(CACHE_DIR)
	npm run clean

rebuild-cache:
	rm -rf $(CACHE_DIR)
	$(MAKE) base-image
