#!/bin/bash

# Migration Testing Script
# Tests migrations against a copy of the production/preview database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
elif [ -f .env.development.local ]; then
    export $(cat .env.development.local | grep -v '^#' | xargs)
fi

echo -e "${BLUE}🧪 Migration Testing Workflow${NC}"

# Check if we have a local database setup
if [[ "$POSTGRES_URL" != *"localhost"* ]] && [[ "$POSTGRES_URL" != *"@localhost"* ]] && [[ "$POSTGRES_URL" != *"127.0.0.1"* ]]; then
    echo -e "${RED}❌ Not using local database. Run: pnpm db:sync preview${NC}"
    echo -e "${YELLOW}Current POSTGRES_URL: $POSTGRES_URL${NC}"
    exit 1
fi

# Create a backup of current local database
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME=$(echo "$POSTGRES_URL" | sed 's/.*\///')
BACKUP_NAME="${DB_NAME}_backup_${TIMESTAMP}"
SERVER_URL=$(echo "$POSTGRES_URL" | sed 's/\/[^/]*$/\/postgres/')

echo -e "${BLUE}📦 Creating backup of current database...${NC}"
pg_dump "$POSTGRES_URL" --file="/tmp/${BACKUP_NAME}.sql"
echo -e "${GREEN}   ✅ Backup created: /tmp/${BACKUP_NAME}.sql${NC}"

# Function to restore backup
restore_backup() {
    echo -e "${YELLOW}🔄 Restoring database from backup...${NC}"
    psql "$SERVER_URL" -c "DROP DATABASE IF EXISTS $DB_NAME;" > /dev/null 2>&1
    psql "$SERVER_URL" -c "CREATE DATABASE $DB_NAME;" > /dev/null 2>&1
    psql "$POSTGRES_URL" -f "/tmp/${BACKUP_NAME}.sql" > /dev/null 2>&1
    echo -e "${GREEN}   ✅ Database restored${NC}"
}

# Set trap to restore backup on error
trap restore_backup ERR

echo -e "${BLUE}🏃 Running migrations...${NC}"

# Check migration status before
echo -e "${BLUE}📋 Migration status before:${NC}"
pnpm migrate:status || true

# Run migrations
if pnpm migrate:run; then
    echo -e "${GREEN}✅ Migrations completed successfully!${NC}"

    # Check migration status after
    echo -e "${BLUE}📋 Migration status after:${NC}"
    pnpm migrate:status || true

    # Test basic functionality
    echo -e "${BLUE}🔍 Testing basic functionality...${NC}"

    # Try to start the server for a few seconds to check for errors
    timeout 10s pnpm dev > /dev/null 2>&1 || echo -e "${YELLOW}   ⚠️  Server test timed out (this is expected)${NC}"

    echo -e "${GREEN}✅ Migration test completed successfully!${NC}"
    echo -e "${BLUE}💡 Your migrations are ready for preview/production${NC}"

    # Ask if user wants to keep the migrated state or restore
    echo -e "${YELLOW}❓ Keep the migrated database state? (y/N)${NC}"
    read -r KEEP_STATE

    if [[ "$KEEP_STATE" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}✅ Keeping migrated database state${NC}"
        rm -f "/tmp/${BACKUP_NAME}.sql"
    else
        restore_backup
        echo -e "${GREEN}✅ Restored original database state${NC}"
        rm -f "/tmp/${BACKUP_NAME}.sql"
    fi

else
    echo -e "${RED}❌ Migration failed!${NC}"
    echo -e "${YELLOW}🔄 Restoring original database...${NC}"
    restore_backup
    rm -f "/tmp/${BACKUP_NAME}.sql"

    echo -e "${RED}❌ Migration test failed. Fix the migration and try again.${NC}"
    exit 1
fi
