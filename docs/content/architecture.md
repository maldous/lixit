# LIXIT Architecture

## Overview

LIXIT is built as a modern microservices architecture with comprehensive observability, security, and development tooling. The system provides multiple API interfaces, extensive monitoring, and a complete development environment.

## Service Catalog & Port Matrix

The following table provides the authoritative reference for all services, their ports, and current implementation status:

### Core Application Services

| Service                | URL                   | Dev Port | Prod Port | Status     | Purpose                   | Technology                     |
| ---------------------- | --------------------- | -------- | --------- | ---------- | ------------------------- | ------------------------------ |
| **Web Application**    | http://localhost:8000 | 8000     | 3000      | ✅ Active  | Primary user interface    | Next.js 15, React, TailwindCSS |
| **Mobile Application** | Expo CLI              | -        | -         | 🔧 Planned | Cross-platform mobile app | React Native, Expo             |
| **Ingestion API**      | http://localhost:3001 | 3001     | 3000      | ✅ Active  | Main backend API          | NestJS, TypeScript             |
| **Document Renderer**  | http://localhost:3002 | 3002     | 3000      | 🔧 Planned | PDF/Excel generation      | Express, Puppeteer, ExcelJS    |
| **LIXI Transform**     | http://localhost:3003 | 3003     | 3000      | 🔧 Planned | LIXI format conversion    | Express, TypeScript            |
| **Submission Broker**  | http://localhost:3004 | 3004     | 3000      | 🔧 Planned | Lender integrations       | Express, TypeScript            |
| **GrapesJS Server**    | http://localhost:3005 | 3005     | 3000      | ✅ Active  | Template editor           | Express, GrapesJS              |
| **PII Redaction**      | http://localhost:3006 | 3006     | 3000      | 🔧 Planned | Privacy compliance        | Python, FastAPI, Presidio      |

### Database & Storage Layer

| Service                 | URL                    | Dev Port | Prod Port | Status    | Purpose            | Credentials              |
| ----------------------- | ---------------------- | -------- | --------- | --------- | ------------------ | ------------------------ |
| **PostgreSQL**          | localhost:5432         | 5432     | 5432      | ✅ Active | Primary database   | lixit/lixit_dev_password |
| **PgBouncer**           | localhost:6432         | 6432     | 6432      | ✅ Active | Connection pooling | lixit/lixit_dev_password |
| **Redis**               | localhost:6379         | 6379     | 6379      | ✅ Active | Caching & sessions | -                        |
| **MinIO**               | http://localhost:9000  | 9000     | 9000      | ✅ Active | Object storage     | minioadmin/minioadmin123 |
| **MinIO Console**       | http://localhost:9001  | 9001     | 9001      | ✅ Active | Storage admin UI   | minioadmin/minioadmin123 |
| **OpenSearch**          | http://localhost:9200  | 9200     | 9200      | ✅ Active | Search & analytics | -                        |
| **RabbitMQ**            | localhost:5672         | 5672     | 5672      | ✅ Active | Message broker     | lixit/lixit_dev_password |
| **RabbitMQ Management** | http://localhost:15672 | 15672    | 15672     | ✅ Active | Queue admin UI     | lixit/lixit_dev_password |

### API Layer

| Service            | URL                   | Dev Port | Prod Port | Status    | Purpose                 | Features                            |
| ------------------ | --------------------- | -------- | --------- | --------- | ----------------------- | ----------------------------------- |
| **PostgREST**      | http://localhost:3008 | 3008     | 3008      | ✅ Active | Auto-generated REST API | Direct PostgreSQL schema mapping    |
| **Hasura GraphQL** | http://localhost:3009 | 3009     | 3009      | ✅ Active | Real-time GraphQL API   | Subscriptions, admin console        |
| **PostGraphile**   | http://localhost:3010 | 3010     | 3010      | ✅ Active | GraphQL from Postgres   | Fine-grained RBAC, high performance |
| **Kong Gateway**   | http://localhost:8002 | 8002     | 8002      | ✅ Active | API gateway             | Rate limiting, auth, plugins        |
| **Kong Admin**     | http://localhost:8003 | 8003     | 8003      | ✅ Active | Gateway administration  | API management interface            |

### Database Management Tools

| Service           | URL                   | Dev Port | Prod Port | Status    | Purpose              | Credentials             |
| ----------------- | --------------------- | -------- | --------- | --------- | -------------------- | ----------------------- |
| **pgAdmin**       | http://localhost:3011 | 3011     | 3011      | ✅ Active | PostgreSQL web admin | admin@example.com/admin |
| **Prisma Studio** | http://localhost:3012 | 3012     | 3012      | ✅ Active | Modern database GUI  | -                       |

### API Documentation

| Service        | URL                   | Dev Port | Prod Port | Status    | Purpose               | Features                  |
| -------------- | --------------------- | -------- | --------- | --------- | --------------------- | ------------------------- |
| **Swagger UI** | http://localhost:3013 | 3013     | 3013      | ✅ Active | Interactive REST docs | Try-it-out functionality  |
| **Redoc**      | http://localhost:3014 | 3014     | 3014      | ✅ Active | Alternative API docs  | Better design, responsive |

### Development Tools

| Service       | URL                   | Dev Port | Prod Port | Status    | Purpose                 | Features                            |
| ------------- | --------------------- | -------- | --------- | --------- | ----------------------- | ----------------------------------- |
| **Storybook** | http://localhost:3015 | 3015     | 3015      | ✅ Active | Component playground    | Design system, isolated development |
| **SonarQube** | http://localhost:3016 | 3016     | 3016      | ✅ Active | Code quality analysis   | Security, tech debt, coverage       |
| **Gitea**     | http://localhost:3017 | 3017     | 3017      | ✅ Active | Self-hosted Git service | Webhooks, CI/CD integration         |
| **MkDocs**    | http://localhost:8001 | 8001     | 8001      | ✅ Active | Documentation site      | Auto-generated from markdown        |

### Observability Stack

| Service                     | URL                    | Dev Port | Prod Port | Status    | Purpose                    | Features                         |
| --------------------------- | ---------------------- | -------- | --------- | --------- | -------------------------- | -------------------------------- |
| **Grafana**                 | http://localhost:3007  | 3007     | 3007      | ✅ Active | Dashboards & visualization | admin/admin                      |
| **Prometheus**              | http://localhost:9090  | 9090     | 9090      | ✅ Active | Metrics collection         | Alerting rules, targets          |
| **Jaeger**                  | http://localhost:16686 | 16686    | 16686     | ✅ Active | Distributed tracing        | Request flow analysis            |
| **AlertManager**            | http://localhost:9093  | 9093     | 9093      | ✅ Active | Alert management           | Routing, grouping, notifications |
| **Loki**                    | http://localhost:3100  | 3100     | 3100      | ✅ Active | Log aggregation            | Centralized logging              |
| **OpenSearch Dashboards**   | http://localhost:5601  | 5601     | 5601      | ✅ Active | Data exploration           | Log visualization                |
| **OpenTelemetry Collector** | localhost:4317-4318    | 4317     | 4317      | ✅ Active | Observability pipeline     | Metrics, logs, traces            |
| **Promtail**                | -                      | -        | -         | ✅ Active | Log shipping               | Container log collection         |

### Monitoring & Health

| Service               | URL                   | Dev Port | Prod Port | Status    | Purpose              | Features                  |
| --------------------- | --------------------- | -------- | --------- | --------- | -------------------- | ------------------------- |
| **Node Exporter**     | http://localhost:9100 | 9100     | 9100      | ✅ Active | Host metrics         | CPU, memory, disk stats   |
| **Blackbox Exporter** | http://localhost:9115 | 9115     | 9115      | ✅ Active | Synthetic monitoring | HTTP/TCP/ICMP probes      |
| **Uptime Kuma**       | http://localhost:3018 | 3018     | 3018      | ✅ Active | Status page          | Uptime monitoring, alerts |

### Security & Compliance

| Service     | URL                   | Dev Port | Prod Port | Status    | Purpose               | Features                        |
| ----------- | --------------------- | -------- | --------- | --------- | --------------------- | ------------------------------- |
| **Trivy**   | http://localhost:8004 | 8004     | 8004      | ✅ Active | Vulnerability scanner | Container & dependency scanning |
| **Step-CA** | http://localhost:9443 | 9443     | 9443      | ✅ Active | Certificate authority | Internal TLS certificates       |

### Infrastructure Services

| Service             | URL                   | Dev Port | Prod Port | Status    | Purpose             | Credentials      |
| ------------------- | --------------------- | -------- | --------- | --------- | ------------------- | ---------------- |
| **Caddy**           | http://localhost:80   | 80       | 80        | ✅ Active | Reverse proxy       | Automatic HTTPS  |
| **Keycloak**        | http://localhost:8080 | 8080     | 8080      | ✅ Active | Identity management | admin/admin      |
| **Docker Registry** | http://localhost:5000 | 5000     | 5000      | ✅ Active | Private registry    | Container images |
| **MailHog**         | http://localhost:8025 | 8025     | 8025      | ✅ Active | Email testing       | SMTP debugging   |

## System Architecture

### Core Application Layer

#### Frontend Applications

- **Web Application** (Next.js) - Primary user interface for loan submissions
- **Mobile Application** (React Native/Expo) - Mobile-first loan application experience (planned)
- **Component Library** (Storybook) - Shared UI components and design system

#### Backend Services

- **Ingestion API** (NestJS) - Main application API with authentication and business logic
- **Document Renderer** (Express) - PDF and Excel generation service (planned)
- **LIXI Transform** (Express) - LIXI format transformation and validation (planned)
- **Submission Broker** (Express) - Lender integration and submission management (planned)
- **GrapesJS Server** (Express) - Template editor for document customization
- **PII Redaction** (Python/FastAPI) - Privacy compliance and data anonymization (planned)

### Data Layer

#### Primary Database

- **PostgreSQL** - Transactional data, user accounts, loan applications
- **PgBouncer** - Connection pooling and database optimization

#### Caching & Sessions

- **Redis** - Session storage, caching, and temporary data

#### File Storage

- **MinIO** - S3-compatible object storage for documents and assets

#### Search & Analytics

- **OpenSearch** - Log aggregation, search, and analytics

### API Gateway & Routing

#### Gateway Services

- **Kong Gateway** - API gateway with rate limiting, authentication, and plugins
- **Caddy** - Reverse proxy with automatic HTTPS and load balancing

#### API Interfaces

- **REST API** (NestJS) - Traditional REST endpoints
- **PostgREST** - Auto-generated REST API directly from PostgreSQL schemas
- **Hasura GraphQL** - Real-time GraphQL with subscriptions and admin console
- **PostGraphile** - High-performance GraphQL API with fine-grained RBAC

### Message Queue & Events

- **RabbitMQ** - Event-driven architecture, background jobs, and inter-service communication

### Identity & Access Management

- **Keycloak** - SSO, user management, and OAuth2/OIDC provider

## Observability Stack

### Metrics & Monitoring

- **Prometheus** - Metrics collection from all services
- **Grafana** - Dashboards, visualization, and alerting
- **Node Exporter** - Host-level metrics (CPU, memory, disk)
- **Blackbox Exporter** - Synthetic monitoring and endpoint health checks

### Logging

- **Loki** - Centralized log aggregation and analysis
- **Promtail** - Log shipping from containers to Loki

### Tracing

- **Jaeger** - Distributed tracing for request flow analysis
- **OpenTelemetry Collector** - Unified pipeline for metrics, logs, and traces

### Alerting & Status

- **AlertManager** - Alert routing, grouping, and notification management
- **Uptime Kuma** - Status page and uptime monitoring with notifications

## Security & Compliance

### Vulnerability Management

- **Trivy** - Container and dependency vulnerability scanning
- **SonarQube** - Static code analysis and security scanning

### Certificate Management

- **Step-CA** - Internal certificate authority for service-to-service communication

### Privacy & Compliance

- **PII Redaction Service** - Automated detection and anonymization of sensitive data (planned)
- **Audit Logging** - Comprehensive audit trails in Loki

## Development Tools

### Database Management

- **pgAdmin** - Web-based PostgreSQL administration and query interface
- **Prisma Studio** - Modern database GUI for data browsing and editing

### API Documentation

- **Swagger UI** - Interactive REST API documentation
- **Redoc** - Alternative API documentation with better design

### Code Quality & CI/CD

- **SonarQube** - Continuous code quality analysis
- **Gitea** - Self-hosted Git service with webhooks and CI integration
- **Docker Registry** - Private container registry for custom images

### Development Support

- **MailHog** - Email testing and debugging
- **MkDocs** - Documentation site generation

## Data Flow Architecture

### Loan Submission Flow

1. **Data Collection** - Web/mobile app collects borrower and loan information
2. **Validation** - Real-time validation using GraphQL subscriptions
3. **Document Processing** - File upload to MinIO, categorization via ML (planned)
4. **LIXI Transformation** - Convert to LIXI format using lender-specific transformers (planned)
5. **File Generation** - Create PDF, Excel, and JSON outputs (planned)
6. **Submission** - Send to lender via configured integration method (planned)
7. **Status Tracking** - Real-time updates via WebSocket connections

### Event-Driven Architecture

- **Document Upload** → Document categorization → PII redaction (planned)
- **Application Submission** → LIXI transformation → File generation → Lender submission (planned)
- **Status Updates** → Real-time notifications → Audit logging

## Scalability & Performance

### Horizontal Scaling

- **Stateless Services** - All application services can be scaled horizontally
- **Load Balancing** - Kong Gateway and Caddy provide load balancing
- **Database Scaling** - Read replicas and connection pooling via PgBouncer

### Caching Strategy

- **Redis** - Application-level caching and session storage
- **CDN** - Static assets served via MinIO with CDN capabilities
- **Database Query Caching** - Optimized queries with proper indexing

### Resource Management

- **Memory Limits** - All services have configured memory limits
- **CPU Limits** - Appropriate CPU allocation for each service
- **Storage** - Persistent volumes for data and configurable retention policies

## Security Architecture

### Network Security

- **Service Mesh** - Internal service communication via Kong
- **TLS Everywhere** - Automatic HTTPS via Caddy and Step-CA
- **Network Isolation** - Docker networks for service isolation

### Authentication & Authorization

- **OAuth2/OIDC** - Keycloak provides standard authentication flows
- **JWT Tokens** - Stateless authentication across services
- **RBAC** - Role-based access control in GraphQL APIs

### Data Protection

- **Encryption at Rest** - Database and file storage encryption
- **Encryption in Transit** - TLS for all service communication
- **PII Handling** - Automated detection and redaction of sensitive data (planned)

## Deployment Architecture

### Container Strategy

- **Multi-stage Builds** - Optimized Docker images with security scanning
- **Base Images** - Shared base images for consistency and security
- **Health Checks** - Comprehensive health checking for all services

### Configuration Management

- **Environment Variables** - Service configuration via environment
- **Secrets Management** - Secure handling of sensitive configuration
- **Feature Flags** - Runtime configuration changes without deployment

### Backup & Recovery

- **Database Backups** - Automated daily backups with retention policies
- **File Storage Backups** - MinIO backup and replication
- **Configuration Backups** - Version-controlled infrastructure as code

## Technology Stack Summary

### Frontend

- **Next.js** - React framework with SSR/SSG
- **React Native/Expo** - Cross-platform mobile development (planned)
- **TailwindCSS** - Utility-first CSS framework
- **Storybook** - Component development and documentation

### Backend

- **NestJS** - Node.js framework with TypeScript
- **Express** - Lightweight Node.js web framework for microservices
- **FastAPI** - Modern Python web framework for ML services (planned)

### Databases

- **PostgreSQL** - Primary relational database
- **Redis** - In-memory data structure store
- **OpenSearch** - Elasticsearch-compatible search and analytics

### Infrastructure

- **Docker** - Containerization platform
- **Kong** - API gateway and service mesh
- **Caddy** - Web server with automatic HTTPS
- **RabbitMQ** - Message broker for event-driven architecture

### Observability

- **Prometheus** - Metrics collection and alerting
- **Grafana** - Visualization and dashboards
- **Loki** - Log aggregation and analysis
- **Jaeger** - Distributed tracing
- **OpenTelemetry** - Unified observability framework

This architecture provides a robust, scalable, and maintainable foundation for the LIXIT loan submission system while ensuring comprehensive observability, security, and developer experience.
