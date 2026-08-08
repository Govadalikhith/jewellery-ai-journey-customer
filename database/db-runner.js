/**
 * Database Migration and Seed Runner
 * Supports both standard PostgreSQL via DATABASE_URL and Embedded PostgreSQL (PGlite)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL || '';

async function runDatabaseScript() {
  console.log('🔄 Initializing Database Runner...');
  
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seeds', '001_jewellery_retail_seed.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  if (DATABASE_URL && !DATABASE_URL.includes('embedded')) {
    console.log(`📡 Connecting to PostgreSQL via DATABASE_URL: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);
    const client = new pg.Client({ connectionString: DATABASE_URL });
    try {
      await client.connect();
      console.log('✅ Connected to external PostgreSQL database.');
      console.log('🚀 Applying schema DDL...');
      await client.query(schemaSql);
      console.log('✅ Schema created successfully.');

      console.log('🌱 Applying seed data...');
      await client.query(seedSql);
      console.log('✅ Seed data inserted successfully.');
      await client.end();
      return;
    } catch (err) {
      console.warn('⚠️ External PostgreSQL connection failed or unavailable. Falling back to embedded PostgreSQL (PGlite)...', err.message);
      try { await client.end(); } catch (e) {}
    }
  }

  // Fallback to embedded PGlite
  console.log('📦 Initializing Embedded PostgreSQL (PGlite)...');
  const dataDir = path.join(__dirname, '..', '.pgdata');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new PGlite(dataDir);
  console.log('🚀 Applying schema DDL on embedded PostgreSQL...');
  await db.exec(schemaSql);
  console.log('✅ Schema applied on embedded PostgreSQL.');

  console.log('🌱 Applying seed data on embedded PostgreSQL...');
  await db.exec(seedSql);
  console.log('✅ Seed data inserted successfully on embedded PostgreSQL.');
  console.log('🎉 Database initialization complete!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runDatabaseScript()
    .then(() => {
      console.log('✨ All database operations finished cleanly.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Database runner error:', err);
      process.exit(1);
    });
}

export { runDatabaseScript };
