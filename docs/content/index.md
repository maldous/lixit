# LIXIT Documentation

Welcome to the LIXIT documentation. LIXIT is a modern, comprehensive LIXI loan submission system with a complete development and production infrastructure stack.

## Overview

LIXIT provides a full-stack solution for loan origination and submission, built on modern microservices architecture with extensive observability, security, and development tooling.

### Core Features
- **LIXI Standard Compliance** - Full support for LIXI 2.6.86 specification
- **Multi-Platform** - Web, mobile, and API interfaces
- **Lender Agnostic** - Pluggable transformer system for different lenders
- **Production Ready** - Complete observability, security, and deployment pipeline
- **100% Self-Hosted** - Uses only open-source tools and free tiers

## Quick Start

- [Installation & Setup](installation.md) - Get started with development environment
- [Architecture Overview](architecture.md) - System design and components
- [API Reference](api.md) - REST and GraphQL API documentation
- [Operations Guide](operations.md) - Monitoring, backup, and maintenance
- [Deployment Guide](deployment.md) - Production deployment procedures
- [Contributing](contributing.md) - Development workflow and guidelines

## Service Catalog

### Core Application Services
- **Web Application** (port 8000) - Next.js frontend
- **Mobile Application** - React Native/Expo mobile app
- **Ingestion API** (port 3001) - Main NestJS API backend
- **Document Renderer** (port 3002) - PDF/Excel generation service
- **LIXI Transform** (port 3003) - LIXI format transformation service
- **Submission Broker** (port 3004) - Lender integration service
- **GrapesJS Server** (port 3005) - Template editor service
- **PII Redaction** (port 3006) - Privacy compliance service

### Database & API Layer
- **PostgreSQL** (port 5432) - Primary database
- **PgBouncer** (port 6432) - Connection pooling
- **Redis** (port 6379) - Caching and session storage
- **PostgREST** (port 3008) - Auto-generated REST API from PostgreSQL
- **Hasura GraphQL** (port 3009) - Real-time GraphQL API with admin console
- **PostGraphile** (port 3010) - High-performance GraphQL API from Postgres

### Database Management
- **pgAdmin** (port 3011) - Web-based PostgreSQL administration
- **Prisma Studio** (port 3012) - Modern database GUI and data browser

### API Documentation
- **Swagger UI** (port 3013) - Interactive REST API documentation
- **Redoc** (port 3014) - Alternative API documentation renderer

### Development Tools
- **Storybook** (port 3015) - Component playground and design system
- **SonarQube** (port 3016) - Code quality and security analysis
- **Gitea** (port 3017) - Self-hosted Git service with CI/CD hooks

### Infrastructure & Gateway
- **Kong Gateway** (ports 8002-8003) - API gateway with rate limiting and auth
- **Caddy** (ports 80, 443) - Reverse proxy with automatic HTTPS
- **MinIO** (ports 9000-9001) - S3-compatible object storage
- **RabbitMQ** (ports 5672, 15672) - Message queue and event bus
- **Keycloak** (port 8080) - Identity and access management

### Observability Stack
- **Prometheus** (port 9090) - Metrics collection and monitoring
- **Grafana** (port 3007) - Dashboards and visualization
- **Loki** (port 3100) - Log aggregation and analysis
- **Jaeger** (port 16686) - Distributed tracing
- **AlertManager** (port 9093) - Alert routing and management
- **OpenTelemetry Collector** (ports 4317-4318) - Unified observability pipeline

### Search & Analytics
- **OpenSearch** (port 9200) - Search and analytics engine
- **OpenSearch Dashboards** (port 5601) - Data exploration and visualization

### Monitoring & Health
- **Node Exporter** (port 9100) - Host metrics for Prometheus
- **Blackbox Exporter** (port 9115) - Synthetic monitoring probes
- **Uptime Kuma** (port 3001) - Status page and uptime monitoring

### Security & Compliance
- **Sentry** (port 9000) - Error tracking and performance monitoring
- **Trivy** (port 8004) - Vulnerability scanner for containers and code
- **Step-CA** (port 9443) - Internal certificate authority

### Development Support
- **MailHog** (ports 1025, 8025) - Email testing and debugging
- **Docker Registry** (port 5000) - Private container registry
- **MkDocs** (port 8001) - Documentation site

## Architecture Highlights

### Microservices Design
- Independent, scalable services
- Event-driven architecture with RabbitMQ
- API-first design with multiple interface options

### Multi-Database Strategy
- PostgreSQL for transactional data
- Redis for caching and sessions
- OpenSearch for logs and analytics
- MinIO for file storage

### Comprehensive Observability
- Metrics, logs, and traces unified through OpenTelemetry
- Real-time dashboards and alerting
- Synthetic monitoring and health checks

### Security-First Approach
- Automated vulnerability scanning
- Certificate management with Step-CA
- PII redaction and privacy compliance
- Rate limiting and authentication

### Developer Experience
- Hot reloading and live updates
- Component-driven development with Storybook
- Multiple API interfaces (REST, GraphQL)
- Comprehensive testing and quality tools

## Getting Started

1. **Prerequisites**: Docker, Node.js 24+, Git
2. **Setup**: `make setup` - Installs dependencies and certificates
3. **Development**: `make dev` - Starts all services
4. **Access**: Visit http://localhost:8000 for the web application

For detailed setup instructions, see [Installation Guide](installation.md).

## Support & Resources

- **Documentation**: Complete guides for all components
- **Monitoring**: Real-time system health via Grafana
- **API Docs**: Interactive documentation via Swagger UI
- **Component Library**: Design system via Storybook
- **Code Quality**: Continuous analysis via SonarQube
