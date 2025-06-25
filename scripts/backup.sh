#!/bin/bash
set -e

# LIXIT Database Backup Script
# Performs PostgreSQL backup with rotation

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

echo "🗄️ Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Perform database dump
pg_dumpall -h postgres -U lixit > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "✅ Backup completed: ${BACKUP_FILE}"
    
    # Compress the backup
    gzip "${BACKUP_FILE}"
    echo "📦 Backup compressed: ${BACKUP_FILE}.gz"
    
    # Backup rotation - keep backups for 14 days
    echo "🧹 Cleaning up old backups..."
    find "${BACKUP_DIR}" -name "*.sql.gz" -mtime +14 -delete
    
    # Show remaining backups
    echo "📋 Current backups:"
    ls -lh "${BACKUP_DIR}"/*.sql.gz 2>/dev/null || echo "No backups found"
    
    # Test backup integrity weekly (on Mondays)
    if [ "$(date +%u)" -eq 1 ]; then
        echo "🔍 Testing backup integrity..."
        if gunzip -t "${BACKUP_FILE}.gz"; then
            echo "✅ Backup integrity check passed"
        else
            echo "❌ Backup integrity check failed"
            exit 1
        fi
    fi
else
    echo "❌ Backup failed"
    exit 1
fi

echo "🎉 Backup process completed successfully"