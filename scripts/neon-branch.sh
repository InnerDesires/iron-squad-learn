#!/bin/bash

# Neon Database Branch Management Script
# Helps developers create and manage isolated database branches for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables from .env files
if [ -f .env.development.local ]; then
    export $(cat .env.development.local | grep -v '^#' | xargs)
elif [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check if neonctl is installed
if ! command -v neonctl &> /dev/null; then
    echo -e "${RED}❌ neonctl is not installed. Please install it first:${NC}"
    echo -e "${BLUE}npm install -g neonctl${NC}"
    echo -e "${BLUE}# or${NC}"
    echo -e "${BLUE}brew install neonctl${NC}"
    exit 1
fi

# Check if authenticated
if ! neonctl me &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with Neon. Please login first:${NC}"
    echo -e "${BLUE}neonctl auth${NC}"
    exit 1
fi

# Check for required environment variable
if [ -z "$NEON_PROJECT_ID" ]; then
    echo -e "${RED}❌ NEON_PROJECT_ID environment variable is required.${NC}"
    echo -e "${YELLOW}Please add it to your .env.development.local file:${NC}"
    echo -e "${BLUE}NEON_PROJECT_ID=\"your-project-id\"${NC}"
    echo -e "${YELLOW}To find your project ID, run:${NC}"
    echo -e "${BLUE}neonctl projects list${NC}"
    exit 1
fi

PROJECT_ID="$NEON_PROJECT_ID"

# Function to show usage
show_usage() {
    echo -e "${BLUE}Neon Database Branch Management${NC}"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  create <branch-name>     Create a new development branch"
    echo "  reset <branch-name>      Reset branch to match main/parent"
    echo "  delete <branch-name>     Delete a development branch"
    echo "  list                     List all branches"
    echo "  connect <branch-name>    Get connection string for branch"
    echo "  setup                    Setup your personal development branch"
    echo ""
    echo "Examples:"
    echo "  $0 setup                 # Create personal dev branch"
    echo "  $0 create feature-auth   # Create feature branch"
    echo "  $0 reset feature-auth    # Reset branch to main state"
    echo "  $0 connect feature-auth  # Get connection string"
}

# Function to create a branch
create_branch() {
    local branch_name="$1"

    if [ -z "$branch_name" ]; then
        echo -e "${RED}❌ Branch name is required${NC}"
        exit 1
    fi

    echo -e "${BLUE}🌿 Creating branch: $branch_name from project: $PROJECT_ID${NC}"

    if neonctl branches create --name "$branch_name" --project-id "$PROJECT_ID"; then
        echo -e "${GREEN}✅ Branch '$branch_name' created successfully${NC}"
        echo -e "${YELLOW}💡 Get connection string with: $0 connect $branch_name${NC}"
    else
        echo -e "${RED}❌ Failed to create branch${NC}"
        exit 1
    fi
}

# Function to reset a branch
reset_branch() {
    local branch_name="$1"

    if [ -z "$branch_name" ]; then
        echo -e "${RED}❌ Branch name is required${NC}"
        exit 1
    fi

    echo -e "${BLUE}🔄 Resetting branch: $branch_name${NC}"

    if neonctl branches reset "$branch_name" --parent --project-id "$PROJECT_ID"; then
        echo -e "${GREEN}✅ Branch '$branch_name' reset successfully${NC}"
    else
        echo -e "${RED}❌ Failed to reset branch${NC}"
        exit 1
    fi
}

# Function to delete a branch
delete_branch() {
    local branch_name="$1"

    if [ -z "$branch_name" ]; then
        echo -e "${RED}❌ Branch name is required${NC}"
        exit 1
    fi

    echo -e "${YELLOW}⚠️  Are you sure you want to delete branch '$branch_name'? (y/N)${NC}"
    read -r confirm

    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🗑️  Deleting branch: $branch_name${NC}"

        if neonctl branches delete "$branch_name" --project-id "$PROJECT_ID"; then
            echo -e "${GREEN}✅ Branch '$branch_name' deleted successfully${NC}"
        else
            echo -e "${RED}❌ Failed to delete branch${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}❌ Deletion cancelled${NC}"
    fi
}

# Function to list branches
list_branches() {
    echo -e "${BLUE}📋 Listing all branches:${NC}"
    neonctl branches list --project-id "$PROJECT_ID"
}

# Function to get connection string
get_connection() {
    local branch_name="$1"

    if [ -z "$branch_name" ]; then
        echo -e "${RED}❌ Branch name is required${NC}"
        exit 1
    fi

    echo -e "${BLUE}🔗 Getting connection string for: $branch_name${NC}"

    local connection_string
    connection_string=$(neonctl connection-string "$branch_name" --project-id "$PROJECT_ID" 2>/dev/null)

    if [ $? -eq 0 ] && [ -n "$connection_string" ]; then
        echo -e "${GREEN}✅ Connection string:${NC}"
        echo "$connection_string"
        echo ""
        echo -e "${YELLOW}💡 Add this to your .env.local:${NC}"
        echo "POSTGRES_URL=\"$connection_string\""
    else
        echo -e "${RED}❌ Failed to get connection string${NC}"
        exit 1
    fi
}

# Function to setup personal dev branch
setup_personal_branch() {
    local username
    username=$(whoami)
    local branch_name="dev-$username"

    echo -e "${BLUE}🚀 Setting up personal development branch: $branch_name${NC}"

    # Check if branch already exists
    if neonctl branches list --project-id "$PROJECT_ID" | grep -q "$branch_name"; then
        echo -e "${YELLOW}⚠️  Branch '$branch_name' already exists. Reset it? (y/N)${NC}"
        read -r confirm

        if [[ "$confirm" =~ ^[Yy]$ ]]; then
            reset_branch "$branch_name"
        fi
    else
        create_branch "$branch_name"
    fi

    echo ""
    get_connection "$branch_name"
    echo ""
    echo -e "${GREEN}🎉 Personal development branch setup complete!${NC}"
    echo -e "${YELLOW}💡 Next steps:${NC}"
    echo -e "   1. Copy the connection string to your .env.local"
    echo -e "   2. Run: pnpm dev"
    echo -e "   3. Access your admin panel at http://localhost:3000/admin"
    echo -e ""
    echo -e "${BLUE}💡 To make this easier next time, add to your .env.development.local:${NC}"
    echo -e "${BLUE}NEON_PROJECT_ID=\"$PROJECT_ID\"${NC}"
}

# Main command handling
case "${1:-}" in
    "create")
        create_branch "$2"
        ;;
    "reset")
        reset_branch "$2"
        ;;
    "delete")
        delete_branch "$2"
        ;;
    "list")
        list_branches
        ;;
    "connect")
        get_connection "$2"
        ;;
    "setup")
        setup_personal_branch
        ;;
    *)
        show_usage
        exit 1
        ;;
esac
