import pg from 'pg'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(join(__dirname, '../supabase/schema.sql'), 'utf8')

const client = new pg.Client({
  connectionString: 'postgresql://postgres.bvzigsuidankvlxhqidn:QF3Z6iegOoAidH7l@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

async function migrate() {
  await client.connect()
  console.log('Connected to Supabase')
  try {
    await client.query(sql)
    console.log('Migration successful!')
  } catch (err) {
    console.error('Migration error:', err.message)
  }
  await client.end()
}

migrate().catch(console.error)
