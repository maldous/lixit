# LIXIT Project Knowledge

## Architecture Overview

LIXIT is a modern LIXI (Lending and Investment eXchange Initiative) loan submission system built as a TypeScript monorepo with microservices architecture.

### Core Design Principles
- **100% Free & Self-Hosted**: Uses only open-source tools and free tiers
- **LIXI Standard Compliance**: Full support for LIXI 2.6.86 specification
- **Lender Agnostic**: Pluggable transformer system for different lenders
- **Multi-Platform**: Web, mobile, and API interfaces
- **Production Ready**: Complete observability, security, and deployment pipeline

### Technology Stack
- **Frontend**: Next.js (web), React Native/Expo (mobile)
- **Backend**: NestJS API + Express microservices
- **Database**: PostgreSQL + PgBouncer + Redis
- **Event Bus**: NATS JetStream or RabbitMQ (Apache-2)
- **Migrations**: node-pg-migrate (MIT) or Sqitch (GPL)
- **Config**: convict or envalid for YAML config governance
- **Storage**: MinIO (S3-compatible)
- **Monitoring**: Prometheus + Grafana + Loki + Jaeger
- **Deployment**: Docker + Fly.io
- **Security**: Trivy, SOPS, Keycloak, rate limiting
- **PII Redaction**: Microsoft Presidio (MIT license)
- **Component Testing**: Storybook + Loki (replacing Chromatic)

## Development Status

### ✅ Complete Infrastructure
- Docker containerization with multi-stage builds
- Full observability stack with retention policies
- Security hardening (rate limiting, auth, secrets)
- CI/CD pipeline with vulnerability scanning
- Database setup with backup rotation
- Fly.io deployment configuration

### 🔧 Business Logic Implementation Needed

#### 1. File Generation Services
**Location**: `packages/core/src/services/file-generation.ts`, `services/doc-renderer/`

**Current State**: Framework exists, implementations are placeholders

**Required Work**:
- Excel generation using ExcelJS with LIXI data mapping
- PDF generation using Puppeteer with branded templates
- JSON validation and formatting

#### 2. Document Categorization
**Location**: `packages/core/src/services/document-categorization.ts`

**Current State**: Rule-based placeholder implementation

**Required Work**:
- OCR integration (Tesseract.js or cloud OCR)
- ML classification model for document types
- Data extraction from bank statements, payslips, tax returns

#### 3. Lender Transformers
**Location**: `packages/core/src/transformers/`

**Current State**: Base transformer class exists, no lender-specific implementations

**Required Work**:
- CBA, ANZ, Westpac, NAB specific transformers
- Custom field mappings per lender
- Integration endpoints and authentication methods

#### 4. Web Application
**Location**: `apps/web/`

**Current State**: Basic Next.js setup with placeholder page

**Required Work**:
- Borrower information forms with validation
- Document upload interface with drag-and-drop
- Submission status dashboard
- Lender selection and configuration

#### 5. Mobile Application
**Location**: `apps/mobile/`

**Current State**: Basic Expo setup with placeholder screen

**Required Work**:
- Document capture via camera with auto-cropping
- Offline form completion with sync
- Push notifications for status updates
- Biometric authentication

#### 6. PII Redaction Service
**Location**: `services/pii-redaction/`

**Current State**: Not implemented

**Required Work**:
- Integrate Microsoft Presidio for PII detection and anonymization
- Python service with FastAPI for HTTP endpoints
- Redact sensitive data from documents and forms
- Consent management for data processing
- GDPR/privacy compliance features

#### 7. Event Bus Integration
**Location**: `docker-compose.yml`, service configurations

**Current State**: Not implemented

**Required Work**:
- Add RabbitMQ or NATS JetStream to docker-compose
- Implement event-driven architecture for submissions
- Add event handlers for status updates and notifications

#### 8. Database Migrations
**Location**: `database/migrations/`

**Current State**: Basic setup exists

**Required Work**:
- Implement `node-pg-migrate` for online migrations
- Create migration scripts for LIXI schema
- Add rollback procedures and testing

#### 9. API Versioning
**Location**: `services/ingestion-api/`

**Current State**: Single version API

**Required Work**:
- Implement versioned routing (v1, v2, etc.)
- Maintain backward compatibility
- Version-specific transformers and validation

#### 10. Component Visual Testing
**Location**: `apps/web/.storybook/`

**Current State**: Basic Storybook setup

**Required Work**:
- Replace Chromatic with Loki for visual regression testing
- Set up automated screenshot comparison
- Integrate with CI pipeline

## Development Workflow

### Adding New Lender Support
1. Create transformer class extending `BaseLIXITransformer`
2. Implement lender-specific field mappings
3. Add integration endpoint configuration
4. Register transformer in `TransformerRegistry`
5. Add tests for transformation logic

### File Generation Development
1. Implement actual generation logic in service classes
2. Add template support for branded outputs
3. Integrate with MinIO for file storage
4. Add progress tracking for large files

### Document Processing Development
1. Integrate OCR library for text extraction
2. Train/configure ML model for classification
3. Add data extraction rules for each document type
4. Implement confidence scoring and manual review

## Deployment Notes

### Local Development
- Use `make dev` to start full stack with observability
- GrapesJS editor available at http://localhost:3005/editor
- All services have health checks and proper logging

### Production Deployment
- Use `scripts/provision.sh` to create Fly.io infrastructure
- Secrets managed via SOPS encryption
- Automatic backup rotation and integrity checking
- Rate limiting and security headers enabled

### Monitoring
- Grafana dashboards for system health
- Loki for centralized logging with 7-day retention
- Jaeger for distributed tracing
- Prometheus alerts for critical issues

## Security Considerations

### Authentication
- Keycloak for SSO and user management
- JWT tokens for API authentication
- Rate limiting on all endpoints

### Data Protection
- All secrets encrypted with SOPS + age
- Database backups encrypted and rotated
- File uploads scanned and validated
- HTTPS enforced in production

### Compliance
- SBOM generation for supply chain security
- License scanning for OSS compliance
- Vulnerability scanning with Trivy
- Audit logging for all submissions

## Performance Optimization

### Caching Strategy
- Redis for session and API response caching
- CDN for static assets via MinIO
- Database query optimization with PgBouncer

### Scaling Considerations
- Microservices can be scaled independently
- File generation can be moved to background jobs
- Document processing can use worker queues
- Database read replicas for reporting

## Testing Strategy

### Unit Tests
- Jest for all TypeScript code
- Test coverage reporting in CI
- Mock external dependencies

### Integration Tests
- API endpoint testing with supertest
- Database integration tests
- File generation validation

### E2E Tests
- Playwright for web application flows
- Mobile testing with Detox
- LIXI submission end-to-end validation

## Config Management Development
1. Replace environment variables with YAML configuration
2. Use `convict` for schema validation and defaults
3. Support environment-specific overrides
4. Document all configuration options

## Event-Driven Architecture
1. Add RabbitMQ or NATS to infrastructure
2. Implement event publishers and subscribers
3. Add event sourcing for audit trails
4. Handle eventual consistency patterns

## PII and Privacy Compliance
1. Integrate Microsoft Presidio for PII detection and anonymization
2. Implement consent management
3. Add data retention policies
4. Create privacy-compliant logging

## ML Model Development
- **Local Training**: Use local GPU or laptop for model development
- **Free Cloud Options**: Kaggle or Google Colab Free for experimentation
- **Model Deployment**: Serve models via simple HTTP endpoints
- **Data Pipeline**: Use event bus for training data collection

## Operational Procedures
- **Per-Service Runbooks**: Markdown files documenting operational procedures
- **Game-Day Drills**: Regular restore testing in CI/CD pipeline
- **Plugin Security**: SHA-256 checksums for plugin verification
- **Config Governance**: YAML-based configuration with schema validation