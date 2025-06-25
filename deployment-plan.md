# LIXIT End-to-End Deployment Plan

## Overview
Complete containerized deployment solution for the LIXIT monorepo with Docker, PostgreSQL, and Fly.io deployment using **100% free and self-hosted** open-source tools.

## Phase 1: Local Development Environment

### 1.1 Docker Configuration
- Create `Dockerfile` for each service (web app, API, services)
- Create `.dockerignore` for optimized builds
- Create `docker-compose.yml` for local development stack
- Create `docker-compose.override.yml` for observability stack
- **Local Docker Registry**: Add `registry:2` service so CI can push/pull images without DockerHub/GHCR limits
- **Resource Limits**: Add `mem_limit`, `cpus` to compose services so dev boxes don't OOM

### 1.2 Database Setup
- PostgreSQL container with initialization scripts
- Database migrations and seeding
- Environment variable configuration
- **Data Durability**: Nightly `pg_dumpall` via cron container → bind-mount `./backups/`
- Optional WAL archiving to **MinIO** (self-hosted S3, free)
- **Migration Automation**: Add `db/migrate.sh` to run on container start (`ENTRYPOINT`) so deploys are zero-touch
- **Disaster Recovery Test**: Schedule `pg_restore --list` dry run weekly in CI to verify backups
- **PgBouncer**: Add side-car (`edoburu/pgbouncer`) for low-memory Fly VMs
- **Keycloak Data**: Add `keycloak-db` Docker/Fly volume to persist realm + users

### 1.3 Service Configuration
- Redis for Bull queues and caching
- **Redis Persistence**: Enable AOF (`appendonly yes`) so Bull queue resumes after restart
- Environment variable templates
- Health check endpoints
- **Env Schema Validation**: Run `envalid` (or `zod`) at app start to fail fast on bad env vars

### 1.4 Security & Secrets
- **Image Security**: Use **Trivy** (`docker run aquasec/trivy`) inside CI to scan images
- Sign images with **cosign**; keys stored in git-ignored `./keys/`
- **Secrets Management**: Encrypt all `.env` files with **SOPS + age** (no server required)
- Decrypt in CI via `AGE_KEY_FILE`
- **Rate Limiting**: Enable Caddy `rate_limit` directive or express `helmet` for basic DoS guard
- **Dependency CVEs**: Run `pnpm audit --recursive --json` in CI to fail builds on high-sev vulns

### 1.5 Observability Stack
- **Prometheus** + **Grafana** + **Loki** stack (all OSS, run as services)
- `docker-compose.override.yml` exposes `prometheus:9090`, `grafana:3000`
- **Jaeger all-in-one** container (`jaegertracing/all-in-one:latest`) for tracing
- Simple **Prometheus Alertmanager** rules (email / Slack webhook)
- **Retention Settings**: Set `--storage.tsdb.retention.time=7d` (Prom) and `retention_period = 168h` (Loki) to keep volumes inside free 1 GB limit
- **Vector Log Shipper** (optional): Light CPU/RAM, forwards container stdout to Loki → one config file, no extra cost

### 1.6 Container Hardening
- Non-root UID: add `USER 1001` in each Dockerfile
- Read-only root FS: `read_only: true` in compose

### 1.7 Mail & Notifications
- **MailHog**: Lightweight SMTP server for dev + relay-to-Gmail option in prod
- Needed by Keycloak, alerting, password reset flows

### 1.8 Object Storage
- **MinIO**: Use same bucket for app uploads (user-files, GrapesJS assets) → configure `S3_ENDPOINT` env
- **MinIO Volume**: Declare `minio-data` docker volume + 1 GB Fly volume for prod
- **GrapesJS Uploads**: Ensure `grapesjs-server` writes to MinIO, not local FS

### 1.9 Local HTTPS
- **mkcert**: For mobile Expo to hit HTTPS in LAN, run in `setup.sh` and mount certs into Caddy
- **Caddy + mkcert**: Note `CADDY_MKCERT=true` env in dev compose so local TLS "just works"

### 1.10 Developer Tooling
- **Makefile**: With `make dev / prod / test / clean / lint`
- **DevContainer**: `.devcontainer/devcontainer.json` so VS Code users get consistent toolchain without local installs (all Docker-based, still free)
- **Dependency Updates**: Add `renovate.json` (or `dependabot.yml`) to keep OSS libs patched

### 1.11 Supply Chain Security
- **SBOM Generation**: Generate CycloneDX via `pnpm dlx @cyclonedx/bom` in CI
- **License Scan**: Add `licensee` GitHub Action to flag non-OSS deps

### 1.12 Infrastructure as Code
- **IaC Note**: Record Fly app/vol commands in `scripts/provision.sh` so new envs are reproducible without Terraform

## Phase 2: Production Deployment

### 2.1 Fly.io Configuration
- `fly.toml` for each deployable service
- Database provisioning on Fly.io
- Use **free 3-shared-CPU/256MB** VMs; `fly deploy --strategy rolling`
- Define VM sizes in each `fly.toml`; keep within free 256M tiers
- **Persistent Volumes**: `fly volumes create` fits free tier (1GB) for prod

### 2.2 CI/CD Pipeline (No Paid SaaS)
- **GitHub Actions** free minutes, cache via `actions/cache`
- Self-hosted runner optional (docker-in-docker) to avoid minute limits
- Automated testing and building
- Deployment automation
- **Testing**: **Playwright** OSS for e2e; headless run in CI

### 2.3 Domain & TLS
- **Caddy** container for automatic Let's Encrypt on your own domain
- Or use Fly's free `*.fly.dev` certs

### 2.4 Deployment & Rollback
- Locally: `docker compose up --scale web=2` for blue/green
- Fly: Use `fly deploy --strategy rolling` (costs $0 within free allowance)
- Document recommended `docker compose --profile prod`

### 2.5 Access Control
- **Keycloak** in docker-compose (free, OSS) or NextAuth "credentials" provider

### 2.6 Mobile OTA Updates
- **EAS Updates**: `eas.json` with `channel: dev` & `channel: prod` (free EAS update)

## Phase 3: Design System Integration

### 3.1 Penpot Integration
- Design system setup
- Component library integration
- Design token management

### 3.2 GrapesJS Integration
- Email template builder
- Document template system
- WYSIWYG editor for forms
- **GrapesJS Service**: Add a tiny `node` service (`grapesjs-server`) so CMS users hit a stable URL

### 3.3 Documentation Site
- **MkDocs Material**: `docs/` → serve via `docker run mkdocs/mkdocs`, completely offline

## Implementation Steps

1. **Docker Setup**: Create Dockerfiles and docker-compose.yml
2. **Security Setup**: Configure Trivy, cosign, SOPS + age
3. **Database Schema**: Set up PostgreSQL with proper migrations
4. **Environment Configuration**: Template files and secrets management
5. **Observability Stack**: Set up Prometheus, Grafana, Loki, Jaeger
6. **Developer Tooling**: Makefile, DevContainer, dependency updates
7. **Supply Chain Security**: SBOM generation, license scanning
8. **Local Testing**: Verify full stack works locally
9. **Fly.io Deployment**: Deploy each service to Fly.io
10. **CI/CD Setup**: Automate the deployment pipeline
11. **Design Tools**: Integrate Penpot and GrapesJS
12. **Documentation**: Complete setup and deployment guides

## File Structure
```
/
├── docker-compose.yml
├── docker-compose.override.yml
├── .dockerignore
├── Dockerfile.web
├── Dockerfile.api
├── Dockerfile.services
├── Dockerfile.grapesjs
├── Makefile
├── renovate.json
├── .devcontainer/
│   └── devcontainer.json
├── keys/                          # Git-ignored, cosign keys
├── backups/                       # Bind-mount for pg_dumpall
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   ├── migrate.sh
│   └── backup.sh
├── .github/workflows/
│   ├── deploy.yml
│   └── license-scan.yml
├── apps/web/
│   └── fly.toml
├── apps/mobile/
│   └── eas.json                   # Updated with channels
├── services/ingestion-api/
│   └── fly.toml
├── services/grapesjs-server/
│   ├── package.json
│   ├── src/
│   └── fly.toml
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── migrate.sh
├── observability/
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   ├── caddy/
│   ├── pgbouncer/
│   └── vector/                    # Optional log shipper
├── docs/
│   ├── operations.md              # Backup/restore procedures
│   └── mkdocs.yml
└── LICENSES/                      # AGPL notices for Penpot, GrapesJS, Keycloak
```

## Technologies
- **Containers**: Docker & Docker Compose
- **Database**: PostgreSQL + PgBouncer
- **Cache/Queue**: Redis (with AOF persistence)
- **Deployment**: Fly.io (free tier)
- **CI/CD**: GitHub Actions (free minutes)
- **Design**: Penpot (open-source Figma alternative)
- **Page Builder**: GrapesJS (open-source page builder)
- **Monitoring**: Prometheus + Grafana + Loki (all OSS)
- **Tracing**: Jaeger (OSS)
- **Security**: Trivy + cosign (OSS)
- **Secrets**: SOPS + age (OSS)
- **Backup**: pg_dumpall + MinIO (OSS)
- **Testing**: Playwright (OSS)
- **Access Control**: Keycloak or NextAuth (OSS)
- **TLS**: Caddy (OSS) or Fly.dev certs (free)
- **Mail**: MailHog (OSS)
- **Registry**: Docker Registry 2 (OSS)
- **Documentation**: MkDocs Material (OSS)
- **Dependencies**: Renovate (OSS)
- **SBOM**: CycloneDX (OSS)
- **License Scanning**: Licensee (OSS)
- **Env Validation**: Envalid or Zod (OSS)

## Persistent Volumes
- Local: `docker volume create lixit_pgdata` (Postgres), `docker volume create minio_data` (MinIO), `docker volume create keycloak_data` (Keycloak)
- Production: `fly volumes create` fits free tier (1GB)

## Result
Everything can be run offline on a single workstation **or** deployed to Fly's free tier without third-party paid services. Complete developer bootstrap with consistent toolchain via DevContainer. Full supply chain security with SBOM generation and license scanning. Reproducible infrastructure provisioning without Terraform.