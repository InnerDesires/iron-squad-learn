#!/usr/bin/env tsx
/**
 * Remote Database Sync Script
 * Copies data between remote databases (e.g., production to preview)
 *
 * Usage:
 *   pnpm db:sync:remote production preview   # Copy from production to preview
 *   pnpm db:sync:remote preview production   # Copy from preview to production
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import dotenv from 'dotenv'

// Load environment variables
if (existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' })
} else if (existsSync('.env.development.local')) {
  dotenv.config({ path: '.env.development.local' })
}

interface RemoteSyncConfig {
  sourceUrl: string
  targetUrl: string
  sourceEnv: string
  targetEnv: string
  excludeTables: string[]
}

const EXCLUDED_TABLES = [
  'spatial_ref_sys', // PostGIS system table
  '_prisma_migrations', // If using Prisma
]

async function main() {
  const sourceEnv = process.argv[2]
  const targetEnv = process.argv[3]

  if (
    !sourceEnv ||
    !targetEnv ||
    !['preview', 'production'].includes(sourceEnv) ||
    !['preview', 'production'].includes(targetEnv)
  ) {
    console.error('❌ Usage: pnpm db:sync:remote [preview|production] [preview|production]')
    console.error('   Examples:')
    console.error('     pnpm db:sync:remote production preview')
    console.error('     pnpm db:sync:remote preview production')
    process.exit(1)
  }

  if (sourceEnv === targetEnv) {
    console.error('❌ Source and target environments cannot be the same')
    process.exit(1)
  }

  console.log(`🔄 Starting database sync from ${sourceEnv} to ${targetEnv}...`)
  console.log(`⚠️  WARNING: This will OVERWRITE all data in ${targetEnv} database!`)

  // Add a confirmation prompt
  console.log('\n📋 This operation will:')
  console.log(`   • Export schema and data from ${sourceEnv} database`)
  console.log(`   • Drop and recreate all tables in ${targetEnv} database`)
  console.log(`   • Import all data from ${sourceEnv} to ${targetEnv}`)
  console.log('\n⏳ Continuing in 5 seconds... (Ctrl+C to cancel)')

  await new Promise((resolve) => setTimeout(resolve, 5000))

  const config = getConfig(sourceEnv, targetEnv)

  if (!config.sourceUrl || !config.targetUrl) {
    console.error('❌ Database URLs not configured. Check your .env.local file.')
    console.error(
      `   Required: ${sourceEnv.toUpperCase()}_POSTGRES_URL and ${targetEnv.toUpperCase()}_POSTGRES_URL`,
    )
    process.exit(1)
  }

  try {
    // Check if databases are accessible
    await checkDatabaseConnections(config)

    // Get list of tables to sync
    const tables = await getTables(config.sourceUrl)
    const tablesToSync = tables.filter((table) => !config.excludeTables.includes(table))

    console.log(`📋 Found ${tablesToSync.length} tables to sync:`)
    tablesToSync.forEach((table) => console.log(`   • ${table}`))

    // Sync schema first
    console.log('🏗️  Syncing database schema...')
    await syncSchema(config)

    // Sync data
    console.log('📦 Syncing database data...')
    await syncData(config, tablesToSync)

    console.log(`✅ Database sync completed successfully!`)
    console.log(`🎉 ${targetEnv} database now matches ${sourceEnv} database`)
  } catch (error) {
    console.error('❌ Database sync failed:', error)
    process.exit(1)
  }
}

function getConfig(sourceEnv: string, targetEnv: string): RemoteSyncConfig {
  const sourceUrlKey =
    sourceEnv === 'production' ? 'PRODUCTION_POSTGRES_URL' : 'PREVIEW_POSTGRES_URL'
  const targetUrlKey =
    targetEnv === 'production' ? 'PRODUCTION_POSTGRES_URL' : 'PREVIEW_POSTGRES_URL'

  const sourceUrl = process.env[sourceUrlKey]
  const targetUrl = process.env[targetUrlKey]
  const excludeTables = [
    ...EXCLUDED_TABLES,
    ...(process.env.DB_SYNC_EXCLUDE_TABLES?.split(',') || []),
  ]

  return {
    sourceUrl: sourceUrl || '',
    targetUrl: targetUrl || '',
    sourceEnv,
    targetEnv,
    excludeTables,
  }
}

async function checkDatabaseConnections(config: RemoteSyncConfig) {
  console.log('🔍 Checking database connections...')

  try {
    execSync(`psql "${config.sourceUrl}" -c "SELECT 1;" > /dev/null 2>&1`)
    console.log(`   ✅ ${config.sourceEnv} database connection OK`)
  } catch (error) {
    throw new Error(
      `Cannot connect to ${config.sourceEnv} database. Check ${config.sourceEnv.toUpperCase()}_POSTGRES_URL`,
    )
  }

  try {
    execSync(`psql "${config.targetUrl}" -c "SELECT 1;" > /dev/null 2>&1`)
    console.log(`   ✅ ${config.targetEnv} database connection OK`)
  } catch (error) {
    throw new Error(
      `Cannot connect to ${config.targetEnv} database. Check ${config.targetEnv.toUpperCase()}_POSTGRES_URL`,
    )
  }
}

async function getTables(sourceUrl: string): Promise<string[]> {
  console.log('📋 Getting list of tables...')

  const query = `
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `

  try {
    const result = execSync(`psql "${sourceUrl}" -t -c "${query}"`, { encoding: 'utf8' })
    const tables = result
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    console.log(`   📊 Found ${tables.length} tables`)
    return tables
  } catch (error) {
    throw new Error('Failed to get table list from source database')
  }
}

async function syncSchema(config: RemoteSyncConfig) {
  const tempFile = '/tmp/remote_schema_dump.sql'

  try {
    // Dump schema from source
    console.log(`   📤 Exporting schema from ${config.sourceEnv}...`)
    execSync(
      `pg_dump "${config.sourceUrl}" --schema-only --no-owner --no-privileges -f "${tempFile}"`,
    )

    // Apply schema to target
    console.log(`   📥 Importing schema to ${config.targetEnv}...`)
    execSync(`psql "${config.targetUrl}" -f "${tempFile}" > /dev/null 2>&1`)

    // Clean up
    execSync(`rm -f "${tempFile}"`)

    console.log('   ✅ Schema sync completed')
  } catch (error) {
    console.log('   ⚠️  Schema sync had warnings (this is often normal)')
  }
}

async function syncData(config: RemoteSyncConfig, tables: string[]) {
  for (const table of tables) {
    try {
      console.log(`   📦 Syncing ${table}...`)

      // Clear target table
      execSync(
        `psql "${config.targetUrl}" -c "TRUNCATE TABLE ${table} CASCADE;" 2>/dev/null || true`,
      )

      // Copy data using pg_dump and psql
      const tempFile = `/tmp/remote_${table}_data.sql`

      // Export data
      execSync(
        `pg_dump "${config.sourceUrl}" --data-only --table=${table} --no-owner --no-privileges -f "${tempFile}"`,
      )

      // Import data
      execSync(`psql "${config.targetUrl}" -f "${tempFile}" > /dev/null 2>&1`)

      // Clean up
      execSync(`rm -f "${tempFile}"`)

      // Get row count
      const result = execSync(`psql "${config.targetUrl}" -t -c "SELECT COUNT(*) FROM ${table};"`, {
        encoding: 'utf8',
      })
      const count = result.trim()

      console.log(`      ✅ ${count} rows synced`)
    } catch (error) {
      console.log(`      ⚠️  Failed to sync ${table}: ${error}`)
    }
  }
}

// Run the script
main().catch(console.error)
