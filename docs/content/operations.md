# LIXIT Operations Guide

## Overview

This guide covers operational procedures for the LIXIT platform, including backup and restore procedures, monitoring, and troubleshooting.

## Backup and Restore

### Automated Backups

- **Schedule**: Daily at 2 AM UTC
- **Retention**: 14 days
- **Location**: `./backups/` directory
- **Format**: Compressed SQL dumps (`.sql.gz`)

### Manual Backup

```bash
# Create immediate backup
docker compose exec postgres pg_dumpall -U lixit > ./backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup integrity
gunzip -t ./backups/backup_YYYYMMDD_HHMMSS.sql.gz
```

### Restore Procedures

```bash
# Stop services
docker compose down

# Restore from backup
gunzip -c ./backups/backup_YYYYMMDD_HHMMSS.sql.gz | \
  docker compose exec -T postgres psql -U lixit -d lixit

# Start services
docker compose up -d
```

### Game-Day Restore Drill

Monthly restore testing is automated in CI/CD:

- Restores latest backup to test environment
- Validates data integrity
- Tests application functionality
- Reports results to operations team

## Monitoring and Alerting

### Key Metrics

- **Application**: Response times, error rates, throughput
- **Infrastructure**: CPU, memory, disk usage
- **Database**: Connection pool, query performance
- **Storage**: MinIO bucket usage, file upload rates

### Alert Thresholds

- Response time > 2 seconds
- Error rate > 5%
- Memory usage > 80%
- Disk usage > 85%
- Database connections > 90% of pool

### Dashboards

- **System Overview**: http://localhost:3007/d/system
- **Application Metrics**: http://localhost:3007/d/app
- **Infrastructure**: http://localhost:3007/d/infra

## Security Operations

### Certificate Management

- **Local Development**: mkcert certificates (auto-renewed)
- **Production**: Let's Encrypt via Caddy (auto-renewed)
- **Monitoring**: Certificate expiry alerts 30 days before expiration

### Secret Rotation

```bash
# Rotate database passwords
./scripts/rotate-secrets.sh database

# Rotate API keys
./scripts/rotate-secrets.sh api-keys

# Rotate JWT secrets
./scripts/rotate-secrets.sh jwt
```

### Vulnerability Management

- **Dependency Scanning**: Weekly via Renovate
- **Image Scanning**: On every build via Trivy
- **License Compliance**: Automated via Licensee
- **SBOM Generation**: On every release

## Capacity Planning

### Scaling Guidelines

- **Web App**: Scale horizontally (multiple instances)
- **Ingestion API**: Scale horizontally with load balancer
- **Database**: Vertical scaling first, then read replicas
- **Storage**: MinIO scales with additional volumes

### Resource Limits

- **Development**: 8GB RAM, 4 CPU cores
- **Production**: 16GB RAM, 8 CPU cores minimum
- **Database**: 25% of total system memory
- **Cache**: 10% of total system memory

## Incident Response

### Severity Levels

- **P0 (Critical)**: System down, data loss
- **P1 (High)**: Major functionality impaired
- **P2 (Medium)**: Minor functionality impaired
- **P3 (Low)**: Cosmetic issues, feature requests

### Response Procedures

1. **Acknowledge**: Confirm incident receipt
2. **Assess**: Determine severity and impact
3. **Communicate**: Notify stakeholders
4. **Investigate**: Identify root cause
5. **Resolve**: Implement fix
6. **Document**: Post-incident review

### Emergency Contacts

- **On-call Engineer**: +61 XXX XXX XXX
- **Platform Team**: platform@lixit.local
- **Security Team**: security@lixit.local

## Maintenance Windows

### Scheduled Maintenance

- **Frequency**: Monthly, first Sunday 2-4 AM UTC
- **Duration**: 2 hours maximum
- **Notification**: 7 days advance notice
- **Rollback**: 30 minutes maximum

### Emergency Maintenance

- **Authorization**: Platform Lead approval
- **Communication**: Immediate notification
- **Documentation**: Post-maintenance report required

## Compliance and Auditing

### Audit Logs

- **Location**: Centralized in Loki
- **Retention**: 90 days
- **Access**: Restricted to authorized personnel
- **Monitoring**: Automated anomaly detection

### Compliance Checks

- **GDPR**: Data retention and deletion policies
- **SOC 2**: Security controls and monitoring
- **ISO 27001**: Information security management
- **PCI DSS**: Payment data handling (if applicable)

### Regular Reviews

- **Security**: Quarterly security assessments
- **Performance**: Monthly performance reviews
- **Capacity**: Quarterly capacity planning
- **Disaster Recovery**: Annual DR testing
