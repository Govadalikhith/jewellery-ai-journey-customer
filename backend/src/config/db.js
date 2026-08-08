import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool = null;
let pgliteInstance = null;
let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;

  const possibleSchemaPaths = [
    path.join(__dirname, '..', '..', '..', 'database', 'schema.sql'),
    path.join(process.cwd(), 'database', 'schema.sql'),
    path.join(process.cwd(), 'schema.sql')
  ];
  const possibleSeedPaths = [
    path.join(__dirname, '..', '..', '..', 'database', 'seeds', '001_jewellery_retail_seed.sql'),
    path.join(process.cwd(), 'database', 'seeds', '001_jewellery_retail_seed.sql')
  ];

  const schemaPath = possibleSchemaPaths.find(p => fs.existsSync(p));
  const seedPath = possibleSeedPaths.find(p => fs.existsSync(p));

  const schemaSql = schemaPath ? fs.readFileSync(schemaPath, 'utf8') : '';
  const seedSql = seedPath ? fs.readFileSync(seedPath, 'utf8') : '';

  if (env.DATABASE_URL && env.DATABASE_URL !== 'embedded' && !env.DATABASE_URL.includes('embedded')) {
    try {
      console.log(`📡 Connecting to PostgreSQL via connection pool...`);
      pool = new pg.Pool({ connectionString: env.DATABASE_URL });
      const testRes = await pool.query('SELECT NOW() as time');
      console.log('✅ Connected to external PostgreSQL at:', testRes.rows[0].time);

      if (schemaSql) {
        await pool.query(schemaSql);
      }
      if (seedSql) {
        await pool.query(seedSql);
      }
      isInitialized = true;
      return;
    } catch (err) {
      console.warn('⚠️ External PostgreSQL connection failed. Falling back to embedded PostgreSQL (PGlite)...', err.message);
      if (pool) {
        try { await pool.end(); } catch (e) {}
        pool = null;
      }
    }
  }

  // Use Embedded PostgreSQL (PGlite) with memory-safe initialization
  console.log('📦 Initializing Embedded PostgreSQL (PGlite)...');
  try {
    const dbDir = path.join(process.cwd(), '.pgdata');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    pgliteInstance = new PGlite(dbDir);
  } catch (err) {
    console.log('📦 Cloud runtime detected: Initializing in-memory PGlite instance...');
    pgliteInstance = new PGlite();
  }

  // Check if tables already exist to prevent redundant re-parsing in memory
  try {
    const existing = await pgliteInstance.query(`SELECT 1 FROM users LIMIT 1`);
    if (existing.rows && existing.rows.length > 0) {
      console.log('✅ Embedded PostgreSQL engine active and data verified.');
      isInitialized = true;
      return;
    }
  } catch (e) {
    // Tables do not exist yet, proceed with schema creation and seed
  }

  if (schemaSql) {
    await pgliteInstance.exec(schemaSql);
  }
  if (seedSql) {
    await pgliteInstance.exec(seedSql);
  }
  console.log('✅ Embedded PostgreSQL engine initialized & seeded successfully.');
  isInitialized = true;
}

export async function query(text, params = []) {
  if (!isInitialized) {
    await initDb();
  }

  // Normalize parameters: replace boolean/object/array values appropriately
  const normalizedParams = params.map(p => {
    if (p !== null && typeof p === 'object') {
      return JSON.stringify(p);
    }
    return p;
  });

  if (pool) {
    const res = await pool.query(text, normalizedParams);
    return res;
  }

  if (pgliteInstance) {
    const res = await pgliteInstance.query(text, normalizedParams);
    return {
      rows: res.rows || [],
      rowCount: res.rowCount !== undefined ? res.rowCount : (res.rows ? res.rows.length : 0),
      fields: res.fields || []
    };
  }

  throw new Error('Database not initialized');
}

export async function transaction(callback) {
  if (!isInitialized) {
    await initDb();
  }

  if (pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  if (pgliteInstance) {
    await pgliteInstance.exec('BEGIN');
    try {
      const result = await callback({
        query: (t, p) => pgliteInstance.query(t, p)
      });
      await pgliteInstance.exec('COMMIT');
      return result;
    } catch (err) {
      await pgliteInstance.exec('ROLLBACK');
      throw err;
    }
  }
}
