export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  res.status(200).json({
    url: SUPABASE_URL || null,
    anonKey: SUPABASE_ANON_KEY || null
  });
}
