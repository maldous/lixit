# Ingestion API Runbook

## Service Overview

The Ingestion API is the main entry point for LIXI loan submissions. It handles authentication, validation, and routing of prospect and application submissions.

## Service Details

- **Port**: 3001 (development), 3000 (production)
- **Health Check**: `GET /health`
- **API Versions**: v1 (default), v2 (future)
- **Dependencies**: PostgreSQL, Redis, RabbitMQ

## Common Operations

### Health Checks

```bash
# Check service health
curl http://localhost:3001/health

# Check dependencies
docker compose ps postgres redis rabbitmq
```

### Logs

```bash
# View service logs
docker compose logs ingestion-api

# Follow logs in real-time
docker compose logs -f ingestion-api

# View specific log level
docker compose logs ingestion-api | grep ERROR
```

### Restart Service

```bash
# Restart single service
docker compose restart ingestion-api

# Restart with dependencies
docker compose restart ingestion-api postgres redis
```

## Troubleshooting

### High Memory Usage

1. Check for memory leaks in application logs
2. Restart service: `docker compose restart ingestion-api`
3. Monitor with: `docker stats ingestion-api`

### Database Connection Issues

1. Check PostgreSQL health: `docker compose ps postgres`
2. Check PgBouncer: `docker compose ps pgbouncer`
3. Verify connection string in environment variables
4. Restart database stack: `docker compose restart postgres pgbouncer`

### Rate Limiting Triggered

1. Check rate limit logs: `docker compose logs ingestion-api | grep "Too many requests"`
2. Identify source IP from logs
3. Adjust rate limits in `src/main.ts` if legitimate traffic

### API Version Issues

1. Check request headers for version specification
2. Verify version routing in application logs
3. Ensure backward compatibility for deprecated versions

## Monitoring

### Key Metrics

- Request rate and response times
- Error rates by endpoint
- Database connection pool usage
- Memory and CPU utilization

### Alerts

- Response time > 2 seconds
- Error rate > 5%
- Memory usage > 80%
- Database connection failures

## Deployment

### Rolling Update

```bash
# Build new image
docker compose build ingestion-api

# Rolling restart
docker compose up -d ingestion-api
```

### Rollback

```bash
# Revert to previous image
docker compose down ingestion-api
docker compose up -d ingestion-api
```

### Database Migrations

```bash
# Run migrations
docker compose exec ingestion-api pnpm run migrate

# Check migration status
docker compose exec ingestion-api pnpm run migrate:status
```

## Security

### Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configured in: `src/main.ts`
- Override with environment variable: `RATE_LIMIT_MAX`

### Authentication

- JWT tokens required for protected endpoints
- Keycloak integration for SSO
- API key authentication for service-to-service

### CORS

- Development: All origins allowed
- Production: Restricted to `https://lixit.local`

## Configuration

### Environment Variables

- `PORT`: Service port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT signing secret
- `RATE_LIMIT_MAX`: Maximum requests per window

### Feature Flags

- `ENABLE_V2_API`: Enable v2 API endpoints
- `ENABLE_DETAILED_LOGGING`: Enable debug logging
- `ENABLE_METRICS`: Enable Prometheus metrics

## Emergency Procedures

### Service Down

1. Check service health and logs
2. Restart service and dependencies
3. Verify database connectivity
4. Check for resource constraints
5. Scale horizontally if needed

### Data Corruption

1. Stop service immediately
2. Restore from latest backup
3. Run data integrity checks
4. Resume service with monitoring

### Security Incident

1. Review access logs for suspicious activity
2. Rotate JWT secrets and API keys
3. Update rate limiting rules
4. Notify security team
