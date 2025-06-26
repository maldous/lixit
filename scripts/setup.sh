#!/bin/bash
set -e

# LIXIT Setup Script
# Initial project setup for development environment

echo "🚀 Setting up LIXIT development environment..."

#!/bin/bash
set -e

echo "🚀 Setting up LIXIT development environment with Volta…"

# Install Volta if missing
if ! command -v volta &> /dev/null; then
  echo "📥 Installing Volta (node/tool manager)…"
  curl https://get.volta.sh | bash
  export VOLTA_HOME="$HOME/.volta"
  export PATH="$VOLTA_HOME/bin:$PATH"
fi

# Ensure Volta is on PATH
export VOLTA_HOME="${VOLTA_HOME:-$HOME/.volta}"
export PATH="$VOLTA_HOME/bin:$PATH"

# Use Volta to install or pin latest Node (and npm)
echo "🔧 Pinning Node@latest via Volta…"
volta install node@latest

# Use Volta to install package managers & tools
echo "🔧 Installing tooling via Volta…"
volta install npm@latest
volta install yarn@latest
volta install pnpm@latest
volta install turbo

# Check Docker & Docker Compose (leave to host package manager)
if ! command -v docker &> /dev/null; then
  echo "❌ Docker not found; please install Docker manually."
  exit 1
fi
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
  echo "❌ Docker Compose not found; please install Docker Compose manually."
  exit 1
fi

echo "✅ Prerequisites are met (Volta, Node, npm, yarn, pnpm, turbo, Docker)."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backups
mkdir -p keys
mkdir -p database/migrations
mkdir -p database/seeds
mkdir -p observability/prometheus
mkdir -p observability/grafana/provisioning/datasources
mkdir -p observability/grafana/provisioning/dashboards
mkdir -p observability/grafana/dashboards
mkdir -p observability/alertmanager
mkdir -p observability/promtail
mkdir -p docs
mkdir -p LICENSES
mkdir -p plugins

# Generate mkcert certificates for local HTTPS
echo "🔐 Generating local HTTPS certificates..."
if command -v mkcert &> /dev/null; then
    cd keys
    mkcert -install
    mkcert localhost 127.0.0.1 ::1
    cd ..
    echo "✅ HTTPS certificates generated"
else
    echo "⚠️  mkcert not found. Installing..."
    # Install mkcert based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
        chmod +x mkcert-v*-linux-amd64
        sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install mkcert
    else
        echo "⚠️  Please install mkcert manually for your OS"
    fi
    
    # Try again
    if command -v mkcert &> /dev/null; then
        cd keys
        mkcert -install
        mkcert localhost 127.0.0.1 ::1
        cd ..
        echo "✅ HTTPS certificates generated"
    fi
fi

# Create environment files
echo "⚙️  Creating environment configuration..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# LIXIT Local Development Environment
NODE_ENV=development
DATABASE_URL=postgresql://lixit:lixit_dev_password@localhost:5432/lixit
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_BUCKET=lixit-uploads
JWT_SECRET=dev-jwt-secret-change-in-production
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=lixit
KEYCLOAK_CLIENT_ID=lixit-web
EOF
    echo "✅ Environment file created"
fi

# Build packages
echo "🔨 Building packages..."
npm run build

echo "✅ LIXIT setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "  1. Run 'make dev' to start the development environment"
echo "  2. Visit http://localhost:8000 to access the web app"
echo "  3. Visit http://localhost:3000 to access Grafana (admin/admin)"
echo "  4. Visit http://localhost:8001 to access documentation"
echo ""
echo "📚 For more information, see INSTALL.md"
