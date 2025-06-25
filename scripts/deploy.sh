#!/bin/bash
set -e

# LIXIT Deployment Script
# Deploys services to Fly.io or local production environment

ENVIRONMENT="${1:-local}"
SERVICES="${2:-all}"

echo "🚀 Deploying LIXIT to ${ENVIRONMENT} environment..."

case "${ENVIRONMENT}" in
  "local")
    echo "📦 Building and starting local production environment..."
    
    # Build all images
    docker compose build
    
    # Start production profile
    docker compose --profile prod up -d
    
    echo "✅ Local production deployment complete!"
    echo "Services available at:"
    echo "  Web App:     https://localhost"
    echo "  API:         https://localhost/api"
    echo "  Grafana:     https://localhost/grafana"
    echo "  Docs:        https://localhost/docs"
    ;;
    
  "fly")
    echo "☁️  Deploying to Fly.io..."
    
    # Check if flyctl is installed
    if ! command -v fly &> /dev/null; then
      echo "❌ flyctl is not installed. Please install it first."
      exit 1
    fi
    
    # Deploy services based on selection
    if [ "${SERVICES}" = "all" ] || [ "${SERVICES}" = "web" ]; then
      echo "🌐 Deploying web app..."
      cd apps/web && fly deploy --strategy rolling
      cd ../..
    fi
    
    if [ "${SERVICES}" = "all" ] || [ "${SERVICES}" = "api" ]; then
      echo "🔌 Deploying API..."
      cd services/ingestion-api && fly deploy --strategy rolling
      cd ../..
    fi
    
    if [ "${SERVICES}" = "all" ] || [ "${SERVICES}" = "grapesjs" ]; then
      echo "🎨 Deploying GrapesJS server..."
      cd services/grapesjs-server && fly deploy --strategy rolling
      cd ../..
    fi
    
    if [ "${SERVICES}" = "all" ] || [ "${SERVICES}" = "services" ]; then
      echo "⚙️  Deploying microservices..."
      cd services/doc-renderer && fly deploy --strategy rolling && cd ../..
      cd services/lixi-transform && fly deploy --strategy rolling && cd ../..
      cd services/submission-broker && fly deploy --strategy rolling && cd ../..
      cd services/pii-redaction && fly deploy --strategy rolling && cd ../..
    fi
    
    echo "✅ Fly.io deployment complete!"
    ;;
    
  *)
    echo "❌ Unknown environment: ${ENVIRONMENT}"
    echo "Usage: $0 [local|fly] [all|web|api|grapesjs|services]"
    exit 1
    ;;
esac

echo "🎉 Deployment completed successfully!"