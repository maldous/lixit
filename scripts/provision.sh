#!/bin/bash
set -e

# LIXIT Fly.io Infrastructure Provisioning Script
# This script creates all necessary Fly.io apps and volumes for the LIXIT platform

echo "🚀 Provisioning LIXIT infrastructure on Fly.io..."

# Check if flyctl is installed
if ! command -v fly &> /dev/null; then
    echo "❌ flyctl is not installed. Please install it first:"
    echo "   https://fly.io/docs/getting-started/installing-flyctl/"
    exit 1
fi

# Check if user is logged in
if ! fly auth whoami &> /dev/null; then
    echo "❌ Not logged in to Fly.io. Please run: fly auth login"
    exit 1
fi

# Organization (optional - set if using a specific org)
ORG_FLAG=""
if [ -n "${FLY_ORG}" ]; then
    ORG_FLAG="--org ${FLY_ORG}"
fi

echo "📦 Creating Fly.io applications..."

# Create web application
echo "Creating web app..."
fly apps create lixit-web ${ORG_FLAG} || echo "App lixit-web already exists"

# Create API application
echo "Creating API app..."
fly apps create lixit-api ${ORG_FLAG} || echo "App lixit-api already exists"

# Create GrapesJS server
echo "Creating GrapesJS server app..."
fly apps create lixit-grapesjs ${ORG_FLAG} || echo "App lixit-grapesjs already exists"

# Create document renderer service
echo "Creating document renderer app..."
fly apps create lixit-doc-renderer ${ORG_FLAG} || echo "App lixit-doc-renderer already exists"

# Create LIXI transform service
echo "Creating LIXI transform app..."
fly apps create lixit-lixi-transform ${ORG_FLAG} || echo "App lixit-lixi-transform already exists"

# Create submission broker service
echo "Creating submission broker app..."
fly apps create lixit-submission-broker ${ORG_FLAG} || echo "App lixit-submission-broker already exists"

echo "💾 Creating persistent volumes..."

# Create PostgreSQL volume for API
echo "Creating PostgreSQL volume..."
fly volumes create postgres_data --region syd --size 1 --app lixit-api || echo "Volume postgres_data already exists"

# Create MinIO volume for file storage
echo "Creating MinIO volume..."
fly volumes create minio_data --region syd --size 1 --app lixit-api || echo "Volume minio_data already exists"

# Create Keycloak volume for authentication data
echo "Creating Keycloak volume..."
fly volumes create keycloak_data --region syd --size 1 --app lixit-api || echo "Volume keycloak_data already exists"

echo "🔐 Setting up secrets..."

# Generate random passwords for production
DB_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
MINIO_ACCESS_KEY=$(openssl rand -base64 16)
MINIO_SECRET_KEY=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

# Set secrets for API app
fly secrets set \
    DATABASE_URL="postgresql://lixit:${DB_PASSWORD}@lixit-api.internal:5432/lixit" \
    REDIS_URL="redis://:${REDIS_PASSWORD}@lixit-api.internal:6379" \
    S3_ENDPOINT="http://lixit-api.internal:9000" \
    S3_ACCESS_KEY="${MINIO_ACCESS_KEY}" \
    S3_SECRET_KEY="${MINIO_SECRET_KEY}" \
    S3_BUCKET="lixit-uploads" \
    JWT_SECRET="${JWT_SECRET}" \
    --app lixit-api

# Set secrets for web app
fly secrets set \
    NEXT_PUBLIC_API_URL="https://lixit-api.fly.dev" \
    NEXTAUTH_SECRET="${JWT_SECRET}" \
    --app lixit-web

# Set secrets for GrapesJS server
fly secrets set \
    DATABASE_URL="postgresql://lixit:${DB_PASSWORD}@lixit-api.internal:5432/lixit" \
    S3_ENDPOINT="http://lixit-api.internal:9000" \
    S3_ACCESS_KEY="${MINIO_ACCESS_KEY}" \
    S3_SECRET_KEY="${MINIO_SECRET_KEY}" \
    S3_BUCKET="lixit-uploads" \
    --app lixit-grapesjs

# Set secrets for microservices
for app in lixit-doc-renderer lixit-lixi-transform lixit-submission-broker; do
    fly secrets set \
        DATABASE_URL="postgresql://lixit:${DB_PASSWORD}@lixit-api.internal:5432/lixit" \
        REDIS_URL="redis://:${REDIS_PASSWORD}@lixit-api.internal:6379" \
        --app ${app}
done

echo "🌐 Creating PostgreSQL database..."
fly postgres create lixit-db --region syd --vm-size shared-cpu-1x --volume-size 1 ${ORG_FLAG} || echo "Database lixit-db already exists"

# Attach database to API app
fly postgres attach lixit-db --app lixit-api || echo "Database already attached"

echo "✅ Infrastructure provisioning complete!"
echo ""
echo "📋 Summary:"
echo "  • Apps created: lixit-web, lixit-api, lixit-grapesjs, lixit-doc-renderer, lixit-lixi-transform, lixit-submission-broker"
echo "  • Database: lixit-db (PostgreSQL)"
echo "  • Volumes: postgres_data, minio_data, keycloak_data"
echo "  • Secrets: Database URLs, Redis URLs, S3 credentials, JWT secrets"
echo ""
echo "🚀 Next steps:"
echo "  1. Deploy your applications: fly deploy"
echo "  2. Check app status: fly status --app <app-name>"
echo "  3. View logs: fly logs --app <app-name>"
echo ""
echo "💡 Tip: Save the generated passwords in your password manager!"
echo "   Database password: ${DB_PASSWORD}"
echo "   Redis password: ${REDIS_PASSWORD}"
echo "   MinIO access key: ${MINIO_ACCESS_KEY}"
echo "   MinIO secret key: ${MINIO_SECRET_KEY}"