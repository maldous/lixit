# Installation & Setup Guide

## Prerequisites

### Required Software

- **Docker & Docker Compose** - Container orchestration
- **Node.js 24+** - JavaScript runtime
- **Git** - Version control
- **Make** - Build automation (usually pre-installed on Linux/macOS)

### System Requirements

- **Memory**: 8GB RAM minimum (16GB recommended for full stack)
- **Storage**: 20GB free disk space
- **CPU**: 4 cores minimum (8 cores recommended)
- **Network**: Internet connection for initial setup

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd lixit

# Initial setup (installs dependencies, generates certificates)
make setup

# Start development environment
make dev
```

After setup completes, the web application will be available at http://localhost:8000.

## Service Catalog

Once `make dev` is running, you'll have access to a comprehensive development and production-ready infrastructure:

### Core Application Services

| Service               | URL                   | Purpose                 | Credentials |
| --------------------- | --------------------- | ----------------------- | ----------- |
| **Web Application**   | http://localhost:8000 | Main user interface     | -           |
| **Mobile App**        | Expo CLI              | React Native mobile app | -           |
| **Main API**          | http://localhost:3001 | NestJS backend API      | -           |
| **Document Renderer** | http://localhost:3002 | PDF/Excel generation    | -           |
| **LIXI Transform**    | http://localhost:3003 | LIXI format conversion  | -           |
| **Submission Broker** | http://localhost:3004 | Lender integrations     | -           |
| **GrapesJS Editor**   | http://localhost:3005 | Template editor         | -           |
| **PII Redaction**     | http://localhost:3006 | Privacy compliance      | -           |

### Database & API Layer

| Service            | URL                   | Purpose                 | Credentials                       |
| ------------------ | --------------------- | ----------------------- | --------------------------------- |
| **PostgreSQL**     | localhost:5432        | Primary database        | lixit/lixit_dev_password          |
| **PgBouncer**      | localhost:6432        | Connection pooling      | lixit/lixit_dev_password          |
| **Redis**          | localhost:6379        | Caching & sessions      | -                                 |
| **PostgREST**      | http://localhost:3008 | Auto-generated REST API | -                                 |
| **Hasura GraphQL** | http://localhost:3009 | Real-time GraphQL API   | Admin secret: hasura_admin_secret |
| **PostGraphile**   | http://localhost:3010 | GraphQL from Postgres   | -                                 |

### Database Management Tools

| Service           | URL                   | Purpose              | Credentials             |
| ----------------- | --------------------- | -------------------- | ----------------------- |
| **pgAdmin**       | http://localhost:3011 | PostgreSQL web admin | admin@example.com/admin |
| **Prisma Studio** | http://localhost:3012 | Modern database GUI  | -                       |

### API Documentation

| Service        | URL                   | Purpose               | Credentials |
| -------------- | --------------------- | --------------------- | ----------- |
| **Swagger UI** | http://localhost:3013 | Interactive REST docs | -           |
| **Redoc**      | http://localhost:3014 | Alternative API docs  | -           |

### Development Tools

| Service       | URL                   | Purpose                 | Credentials |
| ------------- | --------------------- | ----------------------- | ----------- |
| **Storybook** | http://localhost:3015 | Component playground    | -           |
| **SonarQube** | http://localhost:3016 | Code quality analysis   | admin/admin |
| **Gitea**     | http://localhost:3017 | Self-hosted Git service | -           |
| **MkDocs**    | http://localhost:8001 | Documentation site      | -           |

### Infrastructure Services

| Service                 | URL                    | Purpose                    | Credentials              |
| ----------------------- | ---------------------- | -------------------------- | ------------------------ |
| **Kong Gateway**        | http://localhost:8002  | API gateway                | Admin: localhost:8003    |
| **Caddy**               | http://localhost:80    | Reverse proxy              | -                        |
| **MinIO Console**       | http://localhost:9001  | Object storage admin       | minioadmin/minioadmin123 |
| **RabbitMQ Management** | http://localhost:15672 | Message queue admin        | lixit/lixit_dev_password |
| **Keycloak**            | http://localhost:8080  | Identity management        | admin/admin              |
| **Docker Registry**     | http://localhost:5000  | Private container registry | -                        |

### Observability Stack

| Service          | URL                    | Purpose                    | Credentials |
| ---------------- | ---------------------- | -------------------------- | ----------- |
| **Grafana**      | http://localhost:3007  | Dashboards & visualization | admin/admin |
| **Prometheus**   | http://localhost:9090  | Metrics collection         | -           |
| **Jaeger**       | http://localhost:16686 | Distributed tracing        | -           |
| **AlertManager** | http://localhost:9093  | Alert management           | -           |
| **Loki**         | http://localhost:3100  | Log aggregation            | -           |

### Search & Analytics

| Service                   | URL                   | Purpose            | Credentials |
| ------------------------- | --------------------- | ------------------ | ----------- |
| **OpenSearch**            | http://localhost:9200 | Search & analytics | -           |
| **OpenSearch Dashboards** | http://localhost:5601 | Data exploration   | -           |

### Monitoring & Health

| Service               | URL                   | Purpose              | Credentials |
| --------------------- | --------------------- | -------------------- | ----------- |
| **Node Exporter**     | http://localhost:9100 | Host metrics         | -           |
| **Blackbox Exporter** | http://localhost:9115 | Synthetic monitoring | -           |
| **Uptime Kuma**       | http://localhost:3018 | Status page          | -           |

### Security & Compliance

| Service     | URL                   | Purpose               | Credentials |
| ----------- | --------------------- | --------------------- | ----------- |
| **Trivy**   | http://localhost:8004 | Vulnerability scanner | -           |
| **Step-CA** | http://localhost:9443 | Certificate authority | -           |

### Development Support

| Service     | URL                   | Purpose       | Credentials |
| ----------- | --------------------- | ------------- | ----------- |
| **MailHog** | http://localhost:8025 | Email testing | -           |

## Development Workflow

### Starting Services

```bash
# Start all services
make dev

# Start specific service groups
docker compose up -d postgres redis minio  # Core infrastructure
docker compose up -d api web                # Application services
docker compose up -d prometheus grafana     # Monitoring stack
```

### Stopping Services

```bash
# Stop all services
make clean

# Stop specific services
docker compose down api web
```

### Viewing Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f api
docker compose logs -f postgres

# View logs in Grafana
# Visit http://localhost:3007 → Explore → Loki
```

### Database Operations

```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U lixit -d lixit

# Connect via pgAdmin
# Visit http://localhost:3011
# Add server: postgres:5432, lixit/lixit_dev_password

# Browse data with Prisma Studio
# Visit http://localhost:3012
```

### API Development

```bash
# Test REST API
curl http://localhost:3001/api/health

# Explore GraphQL API
# Visit http://localhost:3009 (Hasura Console)
# Visit http://localhost:3010/graphiql (PostGraphile)

# View API documentation
# Visit http://localhost:3013 (Swagger UI)
# Visit http://localhost:3014 (Redoc)
```

### Code Quality & Testing

```bash
# Run tests
make test

# Check code quality
# Visit http://localhost:3016 (SonarQube)

# Lint code
make lint

# Format code
make format

# Type checking
make type-check
```

### Component Development

```bash
# Start Storybook
npm run storybook
# Visit http://localhost:3015

# Develop components in isolation
# Edit files in packages/ui-kit/src/components/
```

## Configuration

### Environment Variables

Create `.env.local` files in service directories for custom configuration:

```bash
# services/ingestion-api/.env.local
DATABASE_URL=postgres://lixit:lixit_dev_password@postgres:5432/lixit
REDIS_URL=redis://redis:6379
S3_ENDPOINT=http://minio:9000
```

### Service Configuration

Most services are configured via environment variables in `docker-compose.yml`. Key configuration files:

- `observability/prometheus/prometheus.yml` - Metrics collection
- `observability/grafana/provisioning/` - Dashboard configuration
- `observability/loki/loki-config.yml` - Log aggregation
- `observability/caddy/Caddyfile` - Reverse proxy rules

### Resource Limits

All services have memory and CPU limits configured. Adjust in `docker-compose.yml` if needed:

```yaml
services:
  api:
    mem_limit: 512m # Increase if needed
    cpus: 1.0 # Adjust CPU allocation
```

## Troubleshooting

### Common Issues

**Port conflicts:**

```bash
# Check what's using a port
lsof -i :8000

# Stop conflicting services
make clean
```

**Memory issues:**

```bash
# Check Docker memory usage
docker stats

# Increase Docker memory in Docker Desktop settings
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

**Service startup failures:**

```bash
# Check service logs
docker compose logs <service-name>

# Restart specific service
docker compose restart <service-name>

# Rebuild service
docker compose build --no-cache <service-name>
```

### Health Checks

Most services include health checks. Check service status:

```bash
# View service health
docker compose ps

# Check specific service health
curl http://localhost:3001/health  # API health
curl http://localhost:9090/-/healthy  # Prometheus health
```

### Performance Monitoring

Monitor system performance via Grafana dashboards:

1. Visit http://localhost:3007
2. Login with admin/admin
3. Browse pre-configured dashboards:
   - System Overview
   - Application Metrics
   - Database Performance
   - Infrastructure Monitoring

## Next Steps

1. **Explore the Web App** - Visit http://localhost:8000
2. **Check System Health** - Visit http://localhost:3007 (Grafana)
3. **Browse APIs** - Visit http://localhost:3013 (Swagger UI)
4. **Develop Components** - Visit http://localhost:3015 (Storybook)
5. **Monitor Logs** - Visit http://localhost:3007 → Explore → Loki
6. **Manage Database** - Visit http://localhost:3011 (pgAdmin)

For production deployment, see the [Deployment Guide](deployment.md).
