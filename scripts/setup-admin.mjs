import pg from 'pg'

const client = new pg.Client({
  connectionString: 'postgresql://postgres.bvzigsuidankvlxhqidn:QF3Z6iegOoAidH7l@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

const sql = `
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE
      WHEN user_count = 0 THEN 'admin'
      WHEN NEW.email = 'nico.janedwardabadiano@gmail.com' THEN 'admin'
      ELSE 'customer'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

UPDATE public.profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'nico.janedwardabadiano@gmail.com');
`

async function run() {
  await client.connect()
  try {
    await client.query(sql)
    console.log('Admin setup complete!')
  } catch (e) {
    console.error('Error:', e.message)
  }
  await client.end()
}

run().catch(console.error)
