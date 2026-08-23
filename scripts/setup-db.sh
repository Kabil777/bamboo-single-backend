#!/usr/bin/env bash
set -e

# Colors for output
GREEN='\033[032m'
BLUE='\033[034m'
YELLOW='\033[1;33m'
RED='\033[031m'
NC='\033[0m' # No Color

# Determine repository root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}  Bamboo Backend - Docker & Database Setup    ${NC}"
echo -e "${BLUE}==============================================${NC}"

# 1. Check Docker status
echo -e "\n${YELLOW}[1/6] Checking Docker daemon...${NC}"
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}Error: Docker daemon is not running. Please start Docker Desktop and retry.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running.${NC}"

# 2. Check environment file
echo -e "\n${YELLOW}[2/6] Checking backend .env configuration...${NC}"
if [ ! -f "${BACKEND_DIR}/.env" ]; then
    if [ -f "${BACKEND_DIR}/.env.example" ]; then
        echo -e "${YELLOW}No .env found in backend. Copying from .env.example...${NC}"
        cp "${BACKEND_DIR}/.env.example" "${BACKEND_DIR}/.env"
    else
        echo -e "${YELLOW}Creating default backend/.env...${NC}"
        cat << 'EOF' > "${BACKEND_DIR}/.env"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bamboo_db?schema=public"
PORT=8092
NODE_ENV=development
PUBLIC_API_URL="http://localhost:8092"
FRONTEND_URL="http://localhost:3000"
LOG_LEVEL="info"
ADMIN_EMAIL="admin@bamboo.local"
JWT_PRIVATE_KEY_PATH="./keys/private.pem"
JWT_PUBLIC_KEY_PATH="./keys/public.pem"
GOOGLE_CLIENT_ID="stub-client-id"
GOOGLE_CLIENT_SECRET="stub-secret"
GOOGLE_CALLBACK_URL="http://localhost:8092/api/v1/auth/callback/google"
EOF
    fi
fi
echo -e "${GREEN}✓ backend/.env is ready.${NC}"

# 3. Start PostgreSQL container
echo -e "\n${YELLOW}[3/6] Starting Docker PostgreSQL container...${NC}"
cd "${ROOT_DIR}"
docker compose up -d --remove-orphans db

echo -e "Waiting for PostgreSQL database to be healthy and ready..."
RETRY_COUNT=0
MAX_RETRIES=30
UNTIL_HEALTHY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker compose exec -T db pg_isready -U postgres -d bamboo_db >/dev/null 2>&1; then
        UNTIL_HEALTHY=true
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 1
done

if [ "$UNTIL_HEALTHY" = true ]; then
    echo -e "${GREEN}✓ PostgreSQL container is healthy and accepting connections.${NC}"
else
    echo -e "${RED}Error: Timed out waiting for PostgreSQL to be ready.${NC}"
    docker compose ps
    exit 1
fi

# 4. Install backend dependencies if needed
echo -e "\n${YELLOW}[4/6] Checking backend dependencies...${NC}"
cd "${BACKEND_DIR}"
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo -e "Installing backend npm packages..."
    npm install
else
    echo -e "${GREEN}✓ Dependencies already installed.${NC}"
fi

# 5. Push database schema / apply migrations & generate Prisma client
echo -e "\n${YELLOW}[5/6] Deploying Prisma migrations & generating Prisma client...${NC}"
npx prisma generate
npx prisma migrate deploy

echo -e "${GREEN}✓ Database migrations applied and Prisma client generated.${NC}"

# 6. Seed initial data
echo -e "\n${YELLOW}[6/6] Seeding initial database tables & admin user...${NC}"
npm run seed:admin || true
npm run seed:reading-platforms || true

# 7. Verification summary
echo -e "\n${BLUE}==============================================${NC}"
echo -e "${GREEN}  ✓ Docker database is connected & tables created!${NC}"
echo -e "${BLUE}==============================================${NC}"
echo -e "Tables in bamboo_db:"
docker compose -f "${ROOT_DIR}/docker-compose.yml" exec -T db psql -U postgres -d bamboo_db -c "\dt"

echo -e "\n${GREEN}To start the backend server:${NC}"
echo -e "  cd backend && npm run dev\n"
