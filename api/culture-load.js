export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { CULTURE_JSONBIN_API_KEY, CULTURE_JSONBIN_BIN_ID } = process.env;
  if (!CULTURE_JSONBIN_API_KEY || !CULTURE_JSONBIN_BIN_ID) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${CULTURE_JSONBIN_BIN_ID}/latest`, {
      headers: { 'X-Master-Key': CULTURE_JSONBIN_API_KEY }
    });
    if (!r.ok) throw new Error(`JSONBin ${r.status}`);
    const json = await r.json();
    res.status(200).json(json.record);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
