# LIXIT Project Knowledge

## Architecture Overview

LIXIT is a modern LIXI (Lending and Investment eXchange Initiative) loan submission system built as a comprehensive TypeScript monorepo with microservices architecture and extensive development tooling.

### Core Design Principles

- **100% Free & Self-Hosted**: Uses only open-source tools and free tiers
- **LIXI Standard Compliance**: Full support for LIXI 2.6.86 specification
- **Lender Agnostic**: Pluggable transformer system for different lenders
- **Multi-Platform**: Web, mobile, and API interfaces
- **Production Ready**: Complete observability, security, and deployment pipeline
- **Developer Experience First**: Comprehensive tooling for development velocity

## Service Catalog

For the complete service catalog with all ports and implementation status, see the [Architecture Guide](docs/content/architecture.md#service-catalog--port-matrix).

### Core Application Services (8 services)

- **Web App** (Next.js, port 8000) - Primary user interface
- **Mobile App** (React Native/Expo) - Cross-platform mobile application (planned)
- **Ingestion API** (NestJS, port 3001 dev / 3000 prod) - Main backend API with authentication
- **Document Renderer** (Express, port 3002) - PDF/Excel generation service (planned)
- **LIXI Transform** (Express, port 3003) - LIXI format transformation (planned)
- **Submission Broker** (Express, port 3004) - Lender integration service (planned)
- **GrapesJS Server** (Express, port 3005) - Template editor service
- **PII Redaction** (Python/FastAPI, port 3006) - Privacy compliance service (planned)

### Database & Storage Layer (6 services)

- **PostgreSQL** (port 5432) - Primary transactional database
- **PgBouncer** (port 6432) - Database connection pooling
- **Redis** (port 6379) - Caching, sessions, and message queues
- **MinIO** (ports 9000-9001) - S3-compatible object storage with web console
- **OpenSearch** (port 9200) - Search and analytics engine for logs
- **RabbitMQ** (ports 5672, 15672) - Message broker with management UI

### API Layer (4 services)

- **PostgREST** (port 3008) - Auto-generated REST API from PostgreSQL schemas
- **Hasura GraphQL** (port 3009) - Real-time GraphQL with admin console and subscriptions
- **PostGraphile** (port 3010) - High-performance GraphQL with fine-grained RBAC
- **Kong Gateway** (ports 8002-8003) - API gateway with rate limiting and authentication

### Database Management Tools (2 services)

- **pgAdmin** (port 3011) - Web-based PostgreSQL administration
- **Prisma Studio** (port 3012) - Modern database GUI for data browsing

### API Documentation (2 services)

- **Swagger UI** (port 3013) - Interactive REST API documentation
- **Redoc** (port 3014) - Alternative API documentation with better design

### Development Tools (4 services)

- **Storybook** (port 3015) - Component playground and design system
- **SonarQube** (port 3016) - Code quality, security analysis, and tech debt tracking
- **Gitea** (port 3017, SSH 2222) - Self-hosted Git service with webhooks
- **MkDocs** (port 8001) - Documentation site generation

### Observability Stack (8 services)

- **Prometheus** (port 9090) - Metrics collection and alerting rules
- **Grafana** (port 3007) - Dashboards, visualization, and alert management
- **Loki** (port 3100) - Log aggregation and analysis
- **Promtail** - Log shipping from containers to Loki
- **Jaeger** (port 16686) - Distributed tracing and request flow analysis
- **AlertManager** (port 9093) - Alert routing, grouping, and notifications
- **OpenTelemetry Collector** (ports 4317-4318) - Unified observability pipeline
- **OpenSearch Dashboards** (port 5601) - Data exploration and log visualization

### Monitoring & Health (3 services)

- **Node Exporter** (port 9100) - Host-level metrics (CPU, memory, disk)
- **Blackbox Exporter** (port 9115) - Synthetic monitoring and endpoint health
- **Uptime Kuma** (port 3018) - Status page and uptime monitoring

### Security & Compliance (2 services)

- **Trivy** (port 8004) - Vulnerability scanner for containers and dependencies
- **Step-CA** (port 9443) - Internal certificate authority for TLS

### Infrastructure Services (4 services)

- **Caddy** (ports 80, 443) - Reverse proxy with automatic HTTPS
- **Keycloak** (port 8080) - Identity and access management (SSO, OAuth2)
- **Docker Registry** (port 5000) - Private container registry
- **MailHog** (ports 1025, 8025) - Email testing and debugging

### Support Services (2 services)

- **Backup Service** - Automated PostgreSQL backups with retention
- **Vector** - Alternative log shipper (configured but not active by default)

## Technology Stack

### Frontend Technologies

- **Next.js 15** - React framework with SSR/SSG and App Router
- **React Native/Expo** - Cross-platform mobile development (planned)
- **TailwindCSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript development
- **Storybook** - Component development and documentation

### Backend Technologies

- **NestJS** - Node.js framework with decorators and dependency injection
- **Express** - Lightweight Node.js web framework for microservices
- **FastAPI** - Modern Python framework for ML/AI services (planned)
- **TypeScript** - Primary language for all Node.js services
- **Python** - For PII redaction and ML services (planned)

### Database Technologies

- **PostgreSQL 15** - Primary relational database with JSON support
- **Redis 7** - In-memory data store for caching and sessions
- **OpenSearch** - Elasticsearch-compatible search and analytics
- **MinIO** - S3-compatible object storage

### Infrastructure Technologies

- **Docker & Docker Compose** - Containerization and orchestration
- **Kong** - API gateway and service mesh
- **Caddy** - Modern web server with automatic HTTPS
- **RabbitMQ** - Message broker for event-driven architecture

### Observability Technologies

- **Prometheus** - Metrics collection and alerting
- **Grafana** - Visualization and dashboards
- **Loki** - Log aggregation and analysis
- **Jaeger** - Distributed tracing
- **OpenTelemetry** - Unified observability framework

## Development Status

### ✅ Complete Infrastructure

- Full containerized development environment with 40+ services
- Comprehensive observability stack with metrics, logs, and traces
- Complete security stack with vulnerability scanning and certificate management
- Multiple API interfaces (REST, GraphQL) with auto-generation
- Database management tools and admin interfaces
- Code quality and development tools
- CI/CD foundation with Git service and registry

### 🔧 Business Logic Implementation Needed

#### 1. File Generation Services (Planned)

**Location**: `packages/core/src/services/file-generation.ts`, `services/doc-renderer/`
**Current State**: Framework exists, implementations are placeholders
**Required Work**:

- Excel generation using ExcelJS with LIXI data mapping
- PDF generation using Puppeteer with branded templates
- JSON validation and formatting

#### 2. Document Categorization (Planned)

**Location**: `packages/core/src/services/document-categorization.ts`
**Current State**: Rule-based placeholder implementation
**Required Work**:

- OCR integration (Tesseract.js or cloud OCR)
- ML classification model for document types
- Data extraction from bank statements, payslips, tax returns

#### 3. Lender Transformers (Planned)

**Location**: `packages/core/src/transformers/`
**Current State**: Base transformer class exists, no lender-specific implementations
**Required Work**:

- CBA, ANZ, Westpac, NAB specific transformers
- Custom field mappings per lender
- Integration endpoints and authentication methods

#### 4. Web Application Business Logic (Planned)

**Location**: `apps/web/`
**Current State**: Basic Next.js setup with placeholder page
**Required Work**:

- Borrower information forms with validation
- Document upload interface with drag-and-drop
- Submission status dashboard
- Lender selection and configuration

#### 5. Mobile Application (Planned)

**Location**: `apps/mobile/`
**Current State**: Basic Expo setup with placeholder screen
**Required Work**:

- Document capture via camera with auto-cropping
- Offline form completion with sync
- Push notifications for status updates
- Biometric authentication

#### 6. PII Redaction Service (Planned)

**Location**: `services/pii-redaction/`
**Current State**: Not implemented
**Required Work**:

- Integrate Microsoft Presidio for PII detection and anonymization
- Python service with FastAPI for HTTP endpoints
- Redact sensitive data from documents and forms
- Consent management for data processing
- GDPR/privacy compliance features

#### 7. Event Bus Integration (Planned)

**Location**: `docker-compose.yml`, service configurations
**Current State**: Not implemented
**Required Work**:

- Add RabbitMQ or NATS JetStream to docker-compose
- Implement event-driven architecture for submissions
- Add event handlers for status updates and notifications

#### 8. Database Migrations (Planned)

**Location**: `database/migrations/`
**Current State**: Basic setup exists
**Required Work**:

- Implement `node-pg-migrate` for online migrations
- Create migration scripts for LIXI schema
- Add rollback procedures and testing

#### 9. API Versioning (Planned)

**Location**: `services/ingestion-api/`
**Current State**: Single version API
**Required Work**:

- Implement versioned routing (v1, v2, etc.)
- Maintain backward compatibility
- Version-specific transformers and validation

#### 10. Component Visual Testing (Planned)

**Location**: `apps/web/.storybook/`
**Current State**: Basic Storybook setup
**Required Work**:

- Replace Chromatic with Loki for visual regression testing
- Set up automated screenshot comparison
- Integrate with CI pipeline

## Development Workflow

### Environment Setup

- **DevContainer**: VS Code development container with all tools pre-installed
- **Local Development**: `make setup && make dev` for full stack
- **Service-Specific**: Individual service development with hot reloading

### Code Quality Pipeline

- **TypeScript**: Strict type checking across all services
- **ESLint**: Code style and quality enforcement
- **Prettier**: Automated code formatting
- **Jest**: Unit testing framework
- **SonarQube**: Continuous code quality analysis
- **Trivy**: Security vulnerability scanning

### API Development Workflow

1. **Schema-First**: Define APIs in OpenAPI/GraphQL schemas
2. **Auto-Generation**: PostgREST and Hasura provide instant APIs
3. **Custom Logic**: Implement business logic in NestJS services
4. **Documentation**: Swagger UI and Redoc for interactive docs
5. **Testing**: Automated API testing and validation

### Database Development

1. **Schema Design**: PostgreSQL with proper indexing and constraints
2. **Migrations**: Version-controlled database changes
3. **Admin Tools**: pgAdmin for complex queries, Prisma Studio for data browsing
4. **Multiple Interfaces**: Direct SQL, REST via PostgREST, GraphQL via Hasura/PostGraphile

### Monitoring & Debugging

1. **Real-time Metrics**: Prometheus + Grafana dashboards
2. **Log Analysis**: Loki for centralized logging with search
3. **Distributed Tracing**: Jaeger for request flow analysis
5. **Synthetic Monitoring**: Blackbox Exporter for endpoint health

## Deployment Architecture

### Local Development

- **Full Stack**: All 40+ services running locally via Docker Compose
- **Resource Management**: Configured memory and CPU limits for each service
- **Hot Reloading**: File watching and automatic rebuilds
- **HTTPS**: Automatic certificate generation via mkcert

### Production Deployment

- **Container Registry**: Private Docker registry for custom images
- **Certificate Management**: Step-CA for internal services, Let's Encrypt for public
- **Backup Strategy**: Automated database backups with retention policies
- **Monitoring**: Full observability stack with alerting

### Security Considerations

- **Vulnerability Scanning**: Trivy scans all containers and dependencies
- **Certificate Management**: Automated TLS certificate provisioning
- **PII Compliance**: Automated detection and redaction of sensitive data (planned)
- **Access Control**: Keycloak for centralized identity management
- **Rate Limiting**: Kong Gateway with configurable rate limits

## Performance Characteristics

### Resource Requirements

- **Development**: 8GB RAM, 4 CPU cores minimum
- **Production**: 16GB RAM, 8 CPU cores recommended
- **Storage**: 20GB for development, scalable for production

### Scaling Strategy

- **Horizontal**: Stateless services can be scaled independently
- **Database**: PostgreSQL with read replicas and connection pooling
- **Caching**: Redis for application-level caching
- **Load Balancing**: Kong Gateway and Caddy for traffic distribution

### Monitoring Thresholds

- **Response Time**: < 2 seconds for API endpoints
- **Error Rate**: < 5% for all services
- **Memory Usage**: < 80% of allocated limits
- **Database Connections**: < 90% of pool size

## Integration Points

### External Services

- **Lender APIs**: Configurable integration endpoints (planned)
- **Document Storage**: S3-compatible via MinIO
- **Email**: SMTP via MailHog (development) or external provider
- **Authentication**: OAuth2/OIDC via Keycloak

### Internal Communication

- **Synchronous**: HTTP/REST between services
- **Asynchronous**: RabbitMQ for event-driven communication
- **Real-time**: WebSocket connections for live updates
- **Database**: Shared PostgreSQL with service-specific schemas

This comprehensive infrastructure provides a production-ready foundation for building the LIXIT loan submission system with extensive development tooling, monitoring, and security features.
