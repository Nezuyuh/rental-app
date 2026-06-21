import pg from 'pg'

const client = new pg.Client({
  connectionString: 'postgresql://postgres.bvzigsuidankvlxhqidn:QF3Z6iegOoAidH7l@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

const sql = `
-- Create SECURITY DEFINER helper to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Fix profiles admin policy
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Fix motorcycles admin policy
DROP POLICY IF EXISTS "motorcycles_admin_all" ON public.motorcycles;
CREATE POLICY "motorcycles_admin_all" ON public.motorcycles
  FOR ALL USING (public.is_admin());

-- Fix bookings admin policy
DROP POLICY IF EXISTS "bookings_admin_all" ON public.bookings;
CREATE POLICY "bookings_admin_all" ON public.bookings
  FOR ALL USING (public.is_admin());
`

async function run() {
  await client.connect()
  try {
    await client.query(sql)
    console.log('RLS fix applied successfully!')
  } catch (e) {
    console.error('Error:', e.message)
  }
  await client.end()
}

run().catch(console.error)
