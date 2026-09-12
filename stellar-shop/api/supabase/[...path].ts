const ALLOWED_PREFIXES = ['auth/v1/', 'rest/v1/', 'storage/v1/', 'functions/v1/'];

function json(res: any, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json').json(body);
}

function getPath(req: any) {
  const raw = Array.isArray(req.query?.path) ? req.query.path.join('/') : String(req.query?.path || '');
  return raw.replace(/^\/+/, '');
}

export default async function handler(req: any, res: any) {
  const path = getPath(req);
  if (!ALLOWED_PREFIXES.some(prefix => path.startsWith(prefix))) {
    return json(res, 404, { error: 'Supabase proxy route not found.' });
  }

  const supabaseUrl = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
  if (!supabaseUrl) return json(res, 500, { error: 'Supabase server URL is not configured.' });

  try {
    const query = new URLSearchParams();
    const q = req.query || {};
    for (const [key, value] of Object.entries(q)) {
      if (key === 'path') continue;
      if (Array.isArray(value)) value.forEach(v => query.append(key, String(v)));
      else if (value !== undefined) query.append(key, String(value));
    }

    const target = `${supabaseUrl}/${path}${query.toString() ? `?${query.toString()}` : ''}`;
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers || {})) {
      if (['host', 'connection', 'content-length'].includes(key.toLowerCase())) continue;
      if (value === undefined) continue;
      headers.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }
    headers.set('host', new URL(supabaseUrl).host);

    let body: BodyInit | undefined;
    if (!['GET', 'HEAD'].includes(String(req.method || 'GET').toUpperCase())) {
      if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) body = req.body as BodyInit;
      else if (req.body !== undefined && req.body !== null) {
        body = JSON.stringify(req.body);
        if (!headers.has('content-type')) headers.set('content-type', 'application/json');
      }
    }

    const upstream = await fetch(target, {
      method: String(req.method || 'GET').toUpperCase(),
      headers,
      body,
      redirect: 'manual',
    });

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (!['content-length', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) res.setHeader(key, value);
    });

    return res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    return json(res, 502, {
      error: 'Supabase proxy could not reach the Supabase project.',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
