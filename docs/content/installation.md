# LIXIT Installation & Development Guide

## Prerequisites

### Required Software

- **Node.js 24+** - JavaScript runtime (specified in .node-version)
- **pnpm** - Package manager (project default)
- **Docker & Docker Compose** - For containerized development
- **Git** - Version control
- **Make** - Build automation (usually pre-installed on Linux/macOS)

### System Requirements

- **Memory**: 8GB RAM minimum (16GB recommended for full stack)
- **Storage**: 20GB free disk space
- **CPU**: 4 cores minimum (8 cores recommended)
- **Network**: Internet connection for initial setup

### Optional Tools

- **VS Code** - Recommended IDE with DevContainer support
- **mkcert** - For local HTTPS certificates (auto-installed via setup script)

## Quick Start

### Option 1: DevContainer (Recommended)

If using VS Code, simply open the project and click "Reopen in Container" when prompted. This provides a fully configured development environment with all tools pre-installed.

### Option 2: Local Development

```bash
# Clone the repository
git clone <repository-url>
cd lixit

# Initial setup (installs dependencies, generates certificates, sets up environment)
make setup

# Start development environment (all 40+ services)
make start
```

## Service Catalog

After running `make start`, you'll have access to a comprehensive development and production-ready infrastructure with 40+ services.

For the complete service catalog with all ports and details, see the [Architecture Guide](architecture.md#service-catalog).

### Core Application Services

| Service                | URL                   | Purpose                      | Technology                     |
| ---------------------- | --------------------- | ---------------------------- | ------------------------------ |
| **Web Application**    | http://localhost:8000 | Primary user interface       | Next.js 15, React, TailwindCSS |
| **Mobile Application** | Expo CLI              | Cross-platform mobile app    | React Native, Expo             |
| **Ingestion API**      | http://localhost:3001 | Main backend API             | NestJS, TypeScript             |
| **Document Renderer**  | http://localhost:3002 | PDF/Excel generation         | Express, Puppeteer, ExcelJS    |
| **LIXI Transform**     | http://localhost:3003 | LIXI format conversion       | Express, TypeScript            |
| **Submission Broker**  | http://localhost:3004 | Lender integrations          | Express, TypeScript            |
| **GrapesJS Server**    | http://localhost:3005 | Template editor              | Express, GrapesJS              |
| **PII Redaction**      | http://localhost:3006 | Privacy compliance (planned) | Python, FastAPI, Presidio      |

### Key Infrastructure Services

| Service           | URL                   | Purpose                 | Credentials              |
| ----------------- | --------------------- | ----------------------- | ------------------------ |
| **PostgreSQL**    | localhost:5432        | Primary database        | lixit/lixit_dev_password |
| **Redis**         | localhost:6379        | Caching & sessions      | -                        |
| **Grafana**       | http://localhost:3007 | Dashboards & monitoring | admin/admin              |
| **Prometheus**    | http://localhost:9090 | Metrics collection      | -                        |
| **MinIO Console** | http://localhost:9001 | Object storage          | minioadmin/minioadmin123 |

## Package Scripts & Development Workflow

This monorepo uses standardized pnpm scripts across all packages, orchestrated by Turbo for efficient parallel execution and caching.

### Root Package Scripts

Run from project root to execute across all workspaces:

```bash
# Build all packages
make build

# Start all development servers
make start

# Run all tests
make test

# Lint all packages
make lint

# Type check all packages
make type-check

# Format all code
make format

# Clean all build artifacts
make clean
```

### Makefile Commands

```bash
# Show all available commands
make help

# Initial project setup
make setup

# Start development environment (all services)
make dev

# Start production-like environment
make prod

# Run all tests
make test

# Run linting
make lint

# Clean up containers and volumes
make clean

# Install dependencies
make install

# Build all packages
make build

# Format code
make format

# Type check all packages
make type-check
```

### Service-Specific Scripts

```bash
# Start individual applications
pnpm web      # Next.js web app on port 8000
pnpm mobile   # Expo mobile app
pnpm api      # NestJS Ingestion API in development mode

# Component development
pnpm storybook        # Start Storybook on port 3015
pnpm build-storybook  # Build static Storybook

# Mobile builds
pnpm build:android    # Build Android APK
```

## Development Workflow

### 1. Environment Setup

```bash
# Full stack development
make setup && make start

# Individual service development
cd services/ingestion-api && pnpm dev
cd apps/web && pnpm dev
```

### 2. Database Development

```bash
# Connect to PostgreSQL directly
docker compose exec postgres psql -U lixit -d lixit

# Use pgAdmin web interface
# Visit http://localhost:3011
# Server: postgres, Port: 5432, User: lixit, Password: lixit_dev_password

# Browse data with Prisma Studio
# Visit http://localhost:3012

# Auto-generated APIs
# REST: http://localhost:3008
# GraphQL: http://localhost:3009 (Hasura)
# GraphQL: http://localhost:3010/graphiql (PostGraphile)
```

### 3. API Development

```bash
# Test Ingestion API
curl http://localhost:3001/api/health

# Interactive API documentation
# Swagger UI: http://localhost:3013
# Redoc: http://localhost:3014

# GraphQL development
# Hasura Console: http://localhost:3009
# PostGraphile: http://localhost:3010/graphiql
```

### 4. Frontend Development

```bash
# Web development with hot reloading
pnpm web

# Component development
pnpm storybook

# Mobile development
pnpm mobile
```

### 5. Testing & Quality

```bash
# Run all tests
make test

# Individual package tests
cd packages/core && pnpm test

# Code quality analysis
# Visit http://localhost:3016 (SonarQube)

# Vulnerability scanning
# Visit http://localhost:8004 (Trivy)
```

### 6. Monitoring & Debugging

```bash
# System monitoring
# Visit http://localhost:3007 (Grafana)

# Log analysis
# Visit http://localhost:3007 → Explore → Loki

# Distributed tracing
# Visit http://localhost:16686 (Jaeger)

# Service health
# Visit http://localhost:3018 (Uptime Kuma)
```

## Mobile Development

### Setup

```bash
# Install Expo CLI globally (if not using DevContainer)
pnpm global add @expo/cli

# Start mobile development
pnpm mobile

# Build Android APK
pnpm build:android
```

### OTA Updates

The mobile app supports Over-The-Air updates via EAS:

- **Dev channel**: For development builds
- **Preview channel**: For internal testing
- **Prod channel**: For production releases

## Production Deployment

### Local Production Environment

```bash
# Start production-like environment
make prod

# Scale services for load testing
docker compose up --scale web=2 --scale api=2
```

### Environment Configuration

Create `.env.local` files in service directories:

```bash
# services/ingestion-api/.env.local
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
S3_ENDPOINT=https://your-s3-endpoint
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
```

## Security & Compliance

### Automated Security Scanning

- **Container Scanning**: Trivy scans all Docker images
- **Dependency Scanning**: Automated vulnerability detection via `pnpm audit`
- **Code Quality**: SonarQube for security analysis
- **License Compliance**: Automated license scanning

### SBOM Generation

```bash
# Generate Software Bill of Materials
pnpm dlx @cyclonedx/cdxgen -t js -o sbom.json --profile research . -p
```

### Certificate Management

- **Development**: Automatic mkcert certificates
- **Production**: Step-CA for internal services
- **Public**: Let's Encrypt via Caddy

## Troubleshooting

### Common Issues

**Port conflicts:**

```bash
# Stop all services
make clean

# Check port usage
lsof -i :8000  # or other port numbers

# Kill conflicting processes
sudo kill -9 $(lsof -t -i:8000)
```

**Docker issues:**

```bash
# Reset Docker environment
docker system prune -a
docker volume prune

# Rebuild containers
docker compose build --no-cache
```

**Memory issues:**

```bash
# Check Docker memory usage
docker stats

# Increase Docker memory in Docker Desktop
# Or adjust service limits in docker-compose.yml
```

**Database connection issues:**

```bash
# Check database status
docker compose ps postgres

# View database logs
docker compose logs postgres

# Reset database
docker compose down postgres
docker volume rm lixit_postgres_data
docker compose up -d postgres
```

### Performance Optimization

**Build performance:**

```bash
# Use Turbo cache for faster builds
pnpm build  # Subsequent builds will be cached

# Parallel builds
pnpm build --parallel
```

**Development performance:**

```bash
# Start only core services
docker compose up -d postgres redis minio api web

# Add monitoring when needed
docker compose up -d prometheus grafana
```

### Health Checks

Check service health:

```bash
# View all service status
docker compose ps

# Check specific service health
curl http://localhost:3001/health      # Ingestion API health
curl http://localhost:9090/-/healthy   # Prometheus health
curl http://localhost:3100/ready       # Loki health
```

### Log Analysis

```bash
# View service logs
docker compose logs -f api
docker compose logs -f postgres

# Centralized logging via Grafana
# Visit http://localhost:3007 → Explore → Loki
```

## Architecture Overview

### Monorepo Structure

```
/
├── apps/                    # Applications
│   ├── web/                # Next.js web app
│   └── mobile/             # Expo mobile app
├── packages/               # Shared packages
│   ├── core/              # Business logic
│   └── ui-kit/            # Shared UI components
├── services/              # Microservices
│   ├── ingestion-api/     # Main Ingestion API (NestJS)
│   ├── doc-renderer/      # Document generation (planned)
│   ├── lixi-transform/    # LIXI transformations (planned)
│   ├── submission-broker/ # Lender integrations (planned)
│   ├── grapesjs-server/   # Template editor
│   └── pii-redaction/     # Privacy compliance (planned)
├── observability/         # Monitoring configuration
├── dockerfiles/           # Container definitions
└── docs/                  # Documentation
```

### Technology Stack Summary

- **Frontend**: Next.js 15, React, TailwindCSS, React Native/Expo
- **Backend**: NestJS, Express, FastAPI (Python)
- **Database**: PostgreSQL 15 + PgBouncer, Redis 7, OpenSearch
- **Storage**: MinIO (S3-compatible)
- **API Layer**: REST, GraphQL (Hasura, PostGraphile), PostgREST
- **Gateway**: Kong API Gateway, Caddy reverse proxy
- **Observability**: Prometheus, Grafana, Loki, Jaeger, OpenTelemetry
- **Security**: Trivy, SonarQube, Step-CA
- **Development**: Storybook, pgAdmin, Prisma Studio, Swagger UI
- **Infrastructure**: Docker, RabbitMQ, Keycloak

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with hot reloading active
4. Run tests: `make test`
5. Check code quality: `make lint && make type-check`
6. Submit a pull request

The CI pipeline automatically:

- Runs tests and type checking
- Scans for vulnerabilities and license compliance
- Generates SBOM (Software Bill of Materials)
- Builds and tests Docker images

## Support & Resources

- **Documentation**: http://localhost:8001 (MkDocs)
- **System Health**: http://localhost:3007 (Grafana)
- **API Documentation**: http://localhost:3013 (Swagger UI)
- **Component Library**: http://localhost:3015 (Storybook)
- **Code Quality**: http://localhost:3016 (SonarQube)
- **Database Admin**: http://localhost:3011 (pgAdmin)
- **Log Analysis**: http://localhost:3007 → Explore → Loki

This comprehensive setup provides everything needed for modern full-stack development with production-grade infrastructure, monitoring, and security.
