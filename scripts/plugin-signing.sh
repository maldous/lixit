#!/bin/bash
set -e

# LIXIT Plugin Signing Script
# Creates SHA-256 checksums for plugin verification

PLUGINS_DIR="${1:-./plugins}"
CHECKSUMS_FILE="${PLUGINS_DIR}/checksums.sha256"

echo "🔐 Signing plugins in ${PLUGINS_DIR}..."

# Create plugins directory if it doesn't exist
mkdir -p "${PLUGINS_DIR}"

# Remove existing checksums file
rm -f "${CHECKSUMS_FILE}"

# Find all plugin files (js, ts, json)
find "${PLUGINS_DIR}" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.json" \) -not -path "*/node_modules/*" | while read -r file; do
    # Calculate SHA-256 checksum
    checksum=$(sha256sum "${file}" | cut -d' ' -f1)
    relative_path=$(realpath --relative-to="${PLUGINS_DIR}" "${file}")
    
    echo "${checksum}  ${relative_path}" >> "${CHECKSUMS_FILE}"
    echo "✅ Signed: ${relative_path}"
done

if [ -f "${CHECKSUMS_FILE}" ]; then
    echo "📋 Plugin checksums written to: ${CHECKSUMS_FILE}"
    echo "🔍 Verification command: sha256sum -c ${CHECKSUMS_FILE}"
else
    echo "⚠️  No plugins found to sign"
fi

echo "🎉 Plugin signing completed"