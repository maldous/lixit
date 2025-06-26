# LIXIT Installation & Development Guide

## Prerequisites

### Required Software
- **Node.js 18+** - JavaScript runtime
- **Yarn 4.9.1+** - Package manager (configured via `packageManager` in package.json)
- **Docker & Docker Compose** - For containerized development
- **Git** - Version control

### Optional Tools
- **VS Code** - Recommended IDE with DevContainer support
- **mkcert** - For local HTTPS certificates (auto-installed via setup script)

## Quick Start

### Option 1: DevContainer (Recommended)
If using VS Code, simply open the project and click "Reopen in Container" when prompted. This provides a fully configured development environment.

### Option 2: Local Development

```bash
# Clone the repository
git clone <repository-url>
cd lixit

# Initial setup (installs dependencies, generates certificates, sets up environment)
make setup

# Start development environment
make dev
```

## Development Environment

### Available Services
After running `make dev`, the following services will be available:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Web App** | http://localhost:8000 | - |
| **API** | http://localhost:3001 | - |
| **Grafana** | http://localhost:3000 | admin/admin |
| **Prometheus** | http://localhost:9090 | - |
| **MailHog** | http://localhost:8025 | - |
| **MinIO Console** | http://localhost:9001 | minioadmin/minioadmin123 |
| **Docker Registry** | http://localhost:5000 | - |
| **Documentation** | http://localhost:8001 | - |
| **GrapesJS Editor** | http://localhost:3005/editor | - |
| **Jaeger Tracing** | http://localhost:16686 | - |
| **Keycloak** | http://localhost:8080 | admin/admin |

### Database Access
- **PostgreSQL**: localhost:5432 (lixit/lixit_dev_password)
- **PgBouncer**: localhost:6432 (connection pooling)
- **Redis**: localhost:6379

## Package Scripts

This monorepo uses standardized npm/npm scripts across all packages. Scripts are orchestrated by Turbo for efficient parallel execution and caching.

### Common Scripts (Available in all packages)

- **`build`** - Compile TypeScript to JavaScript in `dist/` directory
- **`build:prod`** - Production build (same as build for most packages)
- **`dev`** - Development mode with file watching and auto-rebuild
- **`lint`** - Run ESLint to check code quality and style
- **`test`** - Run Jest unit tests
- **`type-check`** - TypeScript type checking without emitting files (`tsc --noEmit`)
- **`clean`** - Remove build artifacts (`rm -rf dist`)
- **`format`** - Format code using Prettier

### Root Package Scripts

Run from project root to execute across all workspaces:

- **`npm build`** - Build all packages (via Turbo)
- **`npm dev`** - Start all development servers in parallel
- **`npm lint`** - Lint all packages
- **`npm test`** - Run all tests
- **`npm type-check`** - Type check all packages
- **`npm clean`** - Clean all packages and remove node_modules
- **`npm format`** - Format all files in the monorepo

### Makefile Commands

- **`make help`** - Show all available commands
- **`make setup`** - Initial project setup (install deps, generate certs)
- **`make dev`** - Start development environment
- **`make prod`** - Start production-like environment
- **`make test`** - Run all tests
- **`make lint`** - Run linting across all packages
- **`make clean`** - Clean up containers and volumes
- **`make install`** - Install dependencies
- **`make build`** - Build all packages
- **`make format`** - Format code
- **`make type-check`** - Type check all packages

### App-Specific Scripts

- **`npm web`** - Start Next.js web app on port 8000
- **`npm mobile`** - Start Expo mobile app
- **`npm api`** - Start NestJS ingestion API in development mode
- **`npm storybook`** - Start Storybook component library on port 6006
- **`npm build-storybook`** - Build static Storybook
- **`npm build:android`** - Build Android APK for mobile app

## Development Workflow

### 1. Making Changes
```bash
# Create a feature branch
git checkout -b feature/your-feature

# Make your changes
# The system uses hot reloading, so changes appear immediately

# Run tests
make test

# Check linting and formatting
make lint
make format

# Type check
make type-check
```

### 2. Testing
```bash
# Run all tests
make test

# Run tests for specific package
cd packages/core && npm test

# Run tests with coverage
cd packages/core && npm test --coverage

# Run tests in watch mode
cd packages/core && npm test --watch
```

### 3. Building
```bash
# Build all packages
make build

# Build specific package
cd packages/core && npm build

# Build for production
npm build:prod
```

## Mobile Development

### Setup
```bash
# Install Expo CLI globally (if not using DevContainer)
npm install -g @expo/cli

# Start mobile development
npm mobile

# Build Android APK
npm build:android
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

# Scale web service for load testing
docker compose up --scale web=2
```

### Fly.io Deployment
1. Install Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Login: `fly auth login`
3. Deploy each service:
   ```bash
   # Deploy web app
   cd apps/web && fly deploy

   # Deploy API
   cd services/ingestion-api && fly deploy
   ```

### Environment Variables
Create `.env.local` files in each app/service directory with production values:
```bash
# Example .env.local for API
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
S3_ENDPOINT=https://your-s3-endpoint
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
```

## Security & Compliance

### SBOM Generation
Software Bill of Materials is automatically generated in CI:
```bash
# Generate SBOM locally
npm install -g @cyclonedx/cdxgen
cdxgen -t js -o sbom.json --profile research . -p
```

### License Scanning
The project automatically scans for license compliance. Only OSS-compatible licenses are allowed.

### Image Security
Docker images are scanned with Trivy in CI:
```bash
# Scan images locally
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image your-image:tag
```

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Stop all services
make clean

# Check what's using ports
lsof -i :8000  # or other port numbers
```

**Docker issues:**
```bash
# Reset Docker environment
docker system prune -a
docker volume prune

# Rebuild containers
docker compose build --no-cache
```

**Node/Yarn issues:**
```bash
# Clear caches
npm cache clean
rm -rf node_modules
npm install
```

**Database connection issues:**
```bash
# Check database status
docker compose ps postgres

# View database logs
docker compose logs postgres

# Connect to database directly
docker compose exec postgres psql -U lixit -d lixit
```

### Performance Optimization

**Memory limits:**
All services have memory limits configured. If you experience OOM issues:
```bash
# Increase Docker memory allocation in Docker Desktop
# Or adjust limits in docker-compose.yml
```

**Build performance:**
```bash
# Use Turbo cache
npm build  # Subsequent builds will be faster

# Parallel builds
npm build --parallel
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
│   ├── ingestion-api/     # Main API
│   ├── doc-renderer/      # Document generation
│   ├── lixi-transform/    # LIXI transformations
│   ├── submission-broker/ # Lender integrations
│   └── grapesjs-server/   # Template editor
└── observability/         # Monitoring stack
```

### Technology Stack
- **Frontend**: Next.js, React, TailwindCSS, React Native
- **Backend**: NestJS, Express, Node.js
- **Database**: PostgreSQL + PgBouncer
- **Cache/Queue**: Redis, Bull
- **Storage**: MinIO (S3-compatible)
- **Monitoring**: Prometheus, Grafana, Loki, Jaeger
- **Security**: Trivy, Cosign, SOPS + Age
- **CI/CD**: GitHub Actions
- **Deployment**: Docker, Fly.io

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

The CI pipeline will automatically:
- Run tests and type checking
- Scan for license compliance
- Generate SBOM
- Build and test Docker images
- Deploy to staging (if configured)

## Support

- **Documentation**: http://localhost:8001 (when running locally)
- **Issues**: Create GitHub issues for bugs and feature requests
- **Monitoring**: Check Grafana dashboards for system health
