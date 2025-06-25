.PHONY: help dev prod test clean lint setup install build

# Default target
help:
	@echo "LIXIT Development Commands"
	@echo "========================="
	@echo "make setup    - Initial project setup (install deps, generate certs)"
	@echo "make dev      - Start development environment"
	@echo "make prod     - Start production-like environment"
	@echo "make test     - Run all tests"
	@echo "make lint     - Run linting across all packages"
	@echo "make clean    - Clean up containers and volumes"
	@echo "make install  - Install dependencies"
	@echo "make build    - Build all packages"

# Initial setup
setup:
	@echo "Setting up LIXIT development environment..."
	@./scripts/setup.sh

# Install dependencies
install:
	@echo "Installing dependencies..."
	@yarn install

# Build all packages
build:
	@echo "Building all packages..."
	@yarn build

# Development environment
dev:
	@echo "Starting development environment..."
	@docker compose up -d
	@echo "Services available at:"
	@echo "  Web App:     http://localhost:8000"
	@echo "  API:         http://localhost:3001"
	@echo "  Grafana:     http://localhost:3000 (admin/admin)"
	@echo "  Prometheus:  http://localhost:9090"
	@echo "  MailHog:     http://localhost:8025"
	@echo "  MinIO:       http://localhost:9001 (minioadmin/minioadmin123)"
	@echo "  Registry:    http://localhost:5000"
	@echo "  Docs:        http://localhost:8001"

# Production-like environment
prod:
	@echo "Starting production environment..."
	@docker compose --profile prod up -d

# Run tests
test:
	@echo "Running tests..."
	@yarn test

# Run linting
lint:
	@echo "Running linting..."
	@yarn lint

# Clean up
clean:
	@echo "Cleaning up containers and volumes..."
	@docker compose down -v
	@docker system prune -f
	@yarn clean

# Format code
format:
	@echo "Formatting code..."
	@yarn format

# Type check
type-check:
	@echo "Type checking..."
	@yarn type-check