# Development Workflow Guide

This guide explains how to develop with isolated Neon database branches for safe migration testing and development.

## 🚀 Quick Start

1. **Install Neon CLI**:
   ```bash
   npm install -g neonctl
   # or
   brew install neonctl
   ```

2. **Authenticate with Neon**:
   ```bash
   neonctl auth
   ```

3. **Add your Neon project ID to .env.development.local**:
   ```bash
   # Find your project ID
   neonctl projects list

   # Add it to your .env.development.local file
   echo 'NEON_PROJECT_ID="your-project-id-here"' >> .env.development.local
   ```

4. **Setup your personal development branch**:
   ```bash
   pnpm db:branch:setup
   ```

5. **Copy the connection string to your .env.local**:
   ```bash
   # Create .env.local and add:
   POSTGRES_URL="postgresql://user:pass@ep-xyz.us-east-1.aws.neon.tech/dbname"
   PAYLOAD_SECRET="your-secret-key"
   BLOB_READ_WRITE_TOKEN="your-blob-token"
   ```

6. **Start development**:
   ```bash
   pnpm dev
   ```

## 🌿 Neon Database Branching

### Why Neon Branches?

- **Isolated Development**: Each developer gets their own database copy
- **No Local Setup**: No PostgreSQL installation or Docker required
- **Production-like Data**: Work with real data structure and content
- **Safe Testing**: Test migrations without affecting others
- **Easy Reset**: Restore to main branch state anytime

### Branch Types

- **Main Branch** (`main`) - Production database
- **Preview Branch** (`preview`) - Vercel preview deployments
- **Development Branches** (`dev-<username>`) - Personal development environments
- **Feature Branches** (`feature-<name>`) - Specific feature development

## 🔄 Development Workflow

### The New Safe Development Process

```mermaid
graph TB
    A["1. Setup Dev Branch"] --> B["2. Make PayloadCMS Changes"]
    B --> C["3. Generate Migration"]
    C --> D["4. Test Migration on Branch"]
    D --> E["5. Create PR"]
    E --> F["6. Test on Preview Branch"]
    F --> G["7. Merge to Production"]

    style A fill:#e1f5fe
    style D fill:#fff3e0
    style F fill:#fff3e0
    style G fill:#e8f5e8
```

### Step-by-Step Guide

#### 1. **Setup Development Branch**
```bash
# Create your personal development branch
pnpm db:branch:setup

# Or create a feature-specific branch
pnpm db:branch:create feature-auth
pnpm db:branch connect feature-auth
```

#### 2. **Make Changes in PayloadCMS**
- Modify collections in `src/collections/`
- Update `src/payload.config.ts`
- Add/remove fields, change localization, etc.

#### 3. **Generate Migration**
```bash
# PayloadCMS will detect schema changes and generate migration
pnpm migrate:create
```

#### 4. **Test Migration on Your Branch**
```bash
# Run migration on your isolated branch
pnpm migrate:run

# Check migration status
pnpm migrate:status

# Test the application
pnpm dev
```

#### 5. **Reset Branch if Needed**
```bash
# If something goes wrong, reset to main branch state
pnpm db:branch:reset dev-<username>
```

#### 6. **Create Pull Request**
- Commit your changes including the new migration file
- Create PR - GitHub Actions will validate migrations
- Review the migration code carefully

#### 7. **Deploy to Production**
- If tests pass, merge to `main`
- Production deployment will run migrations automatically

## 🛠️ Available Commands

### Neon Branch Management
- `pnpm db:branch:setup` - Setup your personal development branch
- `pnpm db:branch:create <name>` - Create a new feature branch
- `pnpm db:branch:reset <name>` - Reset branch to main state
- `pnpm db:branch:list` - List all branches
- `pnpm db:branch connect <name>` - Get connection string for branch

### Migration Commands
- `pnpm migrate:create` - Generate new migration
- `pnpm migrate:run` - Run pending migrations
- `pnpm migrate:status` - Show migration status

### Development Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run all tests

## 🔒 Safety Features

### Automatic Isolation
- Each developer works in their own database branch
- No risk of conflicting with other developers
- Production data stays safe and untouched

### Migration Safety
- Test migrations on isolated branches first
- Easy rollback by resetting branch
- GitHub Actions validate migration syntax
- Preview environment testing before production

### Best Practices
- Always test migrations on your dev branch first
- Use descriptive branch names for features
- Reset your branch regularly to get latest changes
- Keep migrations small and focused

## 🚨 Troubleshooting

### Neon CLI Issues
```bash
# Check if authenticated
neonctl auth status

# Re-authenticate if needed
neonctl auth

# Check available projects
neonctl projects list
```

### Branch Connection Issues
```bash
# List all branches
pnpm db:branch:list

# Get fresh connection string
pnpm db:branch connect <branch-name>

# Verify environment variables
echo $POSTGRES_URL
```

### Migration Issues
```bash
# Check migration status
pnpm migrate:status

# Reset branch and try again
pnpm db:branch:reset <branch-name>
```

## 🎯 Migration Examples

### Adding a New Field
```typescript
// 1. Update collection
export const MyCollection: CollectionConfig = {
  fields: [
    // existing fields...
    {
      name: 'newField',
      type: 'text',
      required: true,
      localized: true,
    }
  ]
}

// 2. Generate migration
// pnpm migrate:create

// 3. Test on your branch
// pnpm migrate:run
```

### Enabling Localization
```typescript
// 1. Update payload.config.ts
export default buildConfig({
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'uk', label: 'Ukrainian' }
    ],
    defaultLocale: 'en'
  }
})

// 2. Update collections with localized fields
// 3. Generate migration - it will create locale tables
```

## 🔧 Environment Setup

### Required Environment Variables

```bash
# .env.local
POSTGRES_URL="postgresql://user:pass@ep-xyz.us-east-1.aws.neon.tech/dbname"
PAYLOAD_SECRET="your-long-secret-key"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Required for Neon CLI (add to .env.development.local)
NEON_PROJECT_ID="your-project-id"
```

### Setting Up New Developer

1. **Install dependencies**:
   ```bash
   pnpm install
   npm install -g neonctl
   ```

2. **Authenticate and setup**:
   ```bash
   neonctl auth
   pnpm db:branch:setup
   ```

3. **Configure environment**:
   ```bash
   # Copy connection string from setup output to .env.local
   ```

4. **Start developing**:
   ```bash
   pnpm dev
   ```

This workflow eliminates the complexity of database syncing while providing each developer with a safe, isolated environment for testing migrations! 🎉
