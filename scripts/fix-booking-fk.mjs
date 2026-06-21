import pg from 'pg'

const client = new pg.Client({
  connectionString: 'postgresql://postgres.bvzigsuidankvlxhqidn:QF3Z6iegOoAidH7l@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

const sql = `
-- Add FK from bookings.user_id to profiles.id so PostgREST can embed profile data.
-- profiles.id is 1:1 with auth.users.id (every user has a profile via trigger).
ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_user_id_profiles_fkey;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Tell PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
`

async function run() {
  await client.connect()
  try {
    await client.query(sql)
    console.log('FK added: bookings.user_id -> profiles.id')
  } catch (e) {
    console.error('Error:', e.message)
  }
  await client.end()
}

run().catch(console.error)
