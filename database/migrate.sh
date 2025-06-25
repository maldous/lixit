#!/bin/bash
set -e

# LIXIT Database Migration Script
# Runs database migrations using node-pg-migrate

COMMAND="${1:-up}"
DATABASE_URL="${DATABASE_URL:-postgresql://lixit:lixit_dev_password@localhost:5432/lixit}"

echo "🗄️ Running database migrations..."

# Check if node-pg-migrate is available
if ! command -v node-pg-migrate &> /dev/null; then
    echo "📦 Installing node-pg-migrate..."
    npm install -g node-pg-migrate
fi

# Set migration directory
MIGRATIONS_DIR="$(dirname "$0")/migrations"

case "${COMMAND}" in
  "up")
    echo "⬆️  Running migrations up..."
    node-pg-migrate -d "${DATABASE_URL}" -m "${MIGRATIONS_DIR}" up
    ;;
  "down")
    echo "⬇️  Running migrations down..."
    node-pg-migrate -d "${DATABASE_URL}" -m "${MIGRATIONS_DIR}" down
    ;;
  "create")
    if [ -z "$2" ]; then
      echo "❌ Migration name required"
      echo "Usage: $0 create <migration-name>"
      exit 1
    fi
    echo "📝 Creating migration: $2"
    node-pg-migrate -d "${DATABASE_URL}" -m "${MIGRATIONS_DIR}" create "$2"
    ;;
  "status")
    echo "📊 Migration status:"
    node-pg-migrate -d "${DATABASE_URL}" -m "${MIGRATIONS_DIR}" status
    ;;
  *)
    echo "❌ Unknown command: ${COMMAND}"
    echo "Usage: $0 [up|down|create|status] [migration-name]"
    exit 1
    ;;
esac

echo "✅ Migration command completed!"