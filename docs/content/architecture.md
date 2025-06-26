# LIXIT Architecture

## Overview

LIXIT is built as a modern microservices architecture with comprehensive observability, security, and development tooling. The system provides multiple API interfaces, extensive monitoring, and a complete development environment.

## System Architecture

### Core Application Layer

#### Frontend Applications
- **Web Application** (Next.js) - Primary user interface for loan submissions
- **Mobile Application** (React Native/Expo) - Mobile-first loan application experience
- **Component Library** (Storybook) - Shared UI components and design system

#### Backend Services
- **Ingestion API** (NestJS) - Main application API with authentication and business logic
- **Document Renderer** (Express) - PDF and Excel generation service
- **LIXI Transform** (Express) - LIXI format transformation and validation
- **Submission Broker** (Express) - Lender integration and submission management
- **GrapesJS Server** (Express) - Template editor for document customization
- **PII Redaction** (Python/FastAPI) - Privacy compliance and data anonymization

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

### Error Tracking
- **Sentry** - Application error tracking and performance monitoring

## Security & Compliance

### Vulnerability Management
- **Trivy** - Container and dependency vulnerability scanning
- **SonarQube** - Static code analysis and security scanning

### Certificate Management
- **Step-CA** - Internal certificate authority for service-to-service communication

### Privacy & Compliance
- **PII Redaction Service** - Automated detection and anonymization of sensitive data
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
3. **Document Processing** - File upload to MinIO, categorization via ML
4. **LIXI Transformation** - Convert to LIXI format using lender-specific transformers
5. **File Generation** - Create PDF, Excel, and JSON outputs
6. **Submission** - Send to lender via configured integration method
7. **Status Tracking** - Real-time updates via WebSocket connections

### Event-Driven Architecture
- **Document Upload** → Document categorization → PII redaction
- **Application Submission** → LIXI transformation → File generation → Lender submission
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
- **PII Handling** - Automated detection and redaction of sensitive data

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
- **React Native/Expo** - Cross-platform mobile development
- **TailwindCSS** - Utility-first CSS framework
- **Storybook** - Component development and documentation

### Backend
- **NestJS** - Node.js framework with TypeScript
- **Express** - Lightweight Node.js web framework
- **FastAPI** - Modern Python web framework for ML services

### Databases
- **PostgreSQL** - Primary relational database
- **Redis** - In-memory data structure store
- **OpenSearch** - Search and analytics engine

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
- **OpenTelemetry** - Observability framework

This architecture provides a robust, scalable, and maintainable foundation for the LIXIT loan submission system while ensuring comprehensive observability, security, and developer experience.
