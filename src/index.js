/**
 * SK Immigration Services — Worker API
 *
 * Serves the static site through the ASSETS binding and handles /api/* itself.
 * Leads are written to D1 so they survive the visitor's browser; the admin
 * endpoints are gated by an HttpOnly, HMAC-signed session cookie.
 */

const SESSION_COOKIE = 'sk_admin';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_FIELD_LENGTH = 2000;
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_MAX_FAILS = 8;
const LOGIN_LOCK_MS = 15 * 60 * 1000;

/* Admin auth: set ADMIN_PASSWORD_HASH + SESSION_SECRET via `wrangler secret put`. No defaults in production. */

const LEAD_TYPES = new Set([
  'contact',
  'booking',
  'eligibility',
  'cv',
  'job_application',
  'attestation',
  'checklist',
  'lead',
  'student',
  'visa_appointment',
  'saudi',
  'employer',
  'quotation',
  'workforce',
]);

const SECURITY_HEADERS = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'cross-origin-opener-policy': 'same-origin-allow-popups',
  'content-security-policy':
    "default-src 'self'; base-uri 'self'; form-action 'self' https://wa.me https://api.whatsapp.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://script.google.com https://script.googleusercontent.com https://wa.me; frame-src 'self' https://www.google.com https://maps.google.com; frame-ancestors 'self'; object-src 'none'; upgrade-insecure-requests",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Apex → www HTTPS redirect (canonical host)
    if (url.hostname === 'salaroutsourcing.com') {
      url.hostname = 'www.salaroutsourcing.com';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    if (!url.pathname.startsWith('/api/')) {
      const assetResponse = await env.ASSETS.fetch(request);
      return withSecurityHeaders(assetResponse);
    }

    try {
      const apiResponse = await route(request, env, ctx, url);
      return withSecurityHeaders(apiResponse);
    } catch (err) {
      console.error('Unhandled API error', err);
      return withSecurityHeaders(json({ ok: false, error: 'internal_error' }, 500));
    }
  },
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function route(request, env, ctx, url) {
  const { pathname } = url;
  const method = request.method.toUpperCase();

  if (pathname === '/api/health' && method === 'GET') {
    return json({ ok: true, storage: env.DB ? 'd1' : 'missing' });
  }
  if (pathname === '/api/lead' && method === 'POST') {
    return handleLead(request, env, ctx);
  }
  if (pathname === '/api/admin/login' && method === 'POST') {
    return handleLogin(request, env);
  }
  if (pathname === '/api/admin/logout' && method === 'POST') {
    return handleLogout();
  }
  if (pathname === '/api/admin/session' && method === 'GET') {
    return json({ ok: true, authenticated: await verifySession(request, env) });
  }
  if (pathname === '/api/admin/leads' && method === 'GET') {
    return handleListLeads(request, env, url);
  }

  return json({ ok: false, error: 'not_found' }, 404);
}

/* ------------------------------------------------------------------ leads */

async function handleLead(request, env, ctx) {
  if (!env.DB) {
    // Fail loudly. A silent success here is what caused every earlier lead to vanish.
    return json({ ok: false, error: 'storage_unavailable' }, 503);
  }

  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'invalid_json' }, 400);

  // Honeypot: real users never see or fill this field.
  if (
    (typeof body.company === 'string' && body.company.trim() !== '') ||
    (typeof body.sk_hp === 'string' && body.sk_hp.trim() !== '') ||
    (body.data && typeof body.data.sk_hp === 'string' && body.data.sk_hp.trim() !== '')
  ) {
    return json({ ok: true, id: null, skipped: true });
  }

  const type = String(body.type || 'lead').toLowerCase();
  if (!LEAD_TYPES.has(type)) return json({ ok: false, error: 'invalid_type' }, 400);

  const data = sanitizeObject(body.data && typeof body.data === 'object' ? body.data : {});
  const name = pickField(data, ['name', 'fullName']);
  const email = pickField(data, ['email']);
  const phone = pickField(data, ['phone', 'whatsapp']);

  if (!name) return json({ ok: false, error: 'name_required' }, 400);
  if (!email && !phone) return json({ ok: false, error: 'contact_required' }, 400);
  if (email && !isEmail(email)) return json({ ok: false, error: 'invalid_email' }, 400);

  const ipHash = await hashIp(request, env);
  if (await isRateLimited(env, ipHash)) {
    return json({ ok: false, error: 'rate_limited' }, 429, { 'retry-after': '600' });
  }

  const lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    type,
    name,
    email,
    phone,
    meta: pickField(data, [
      'meta',
      'service',
      'jobTitle',
      'target',
      'destination',
      'companyName',
      'company',
      'country',
      'trades',
      'workersNeeded',
    ]),
  };

  await env.DB.prepare(
    `INSERT INTO leads (id, created_at, type, name, email, phone, meta, payload, ip_hash, user_agent, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`
  )
    .bind(
      lead.id,
      lead.createdAt,
      lead.type,
      lead.name,
      lead.email,
      lead.phone,
      lead.meta,
      JSON.stringify(data),
      ipHash,
      truncate(request.headers.get('user-agent') || '', 300)
    )
    .run();

  if (env.LEAD_WEBHOOK_URL) {
    ctx.waitUntil(notify(env.LEAD_WEBHOOK_URL, { ...lead, data }));
  }

  return json({ ok: true, id: lead.id });
}

async function notify(webhookUrl, lead) {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
    });
  } catch (err) {
    console.error('Lead webhook failed', err);
  }
}

async function isRateLimited(env, ipHash) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const row = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM leads WHERE ip_hash = ? AND created_at > ?'
  )
    .bind(ipHash, since)
    .first();
  return Number(row?.n || 0) >= RATE_LIMIT_MAX;
}

/* ------------------------------------------------------------------ admin */

function adminPasswordHashes(env) {
  const hashes = new Set();
  if (typeof env.ADMIN_PASSWORD_HASH === 'string' && env.ADMIN_PASSWORD_HASH.trim()) {
    hashes.add(env.ADMIN_PASSWORD_HASH.trim().toLowerCase());
  }
  return hashes;
}

function sessionSecret(env) {
  const secret =
    typeof env.SESSION_SECRET === 'string' ? env.SESSION_SECRET.trim() : '';
  if (!secret) {
    throw new Error('SESSION_SECRET is not configured');
  }
  return secret;
}

async function handleLogin(request, env) {
  const body = await readJson(request);
  const password = body && typeof body.password === 'string' ? body.password : '';
  if (!password) return json({ ok: false, error: 'password_required' }, 400);

  const hashes = adminPasswordHashes(env);
  if (!hashes.size) {
    return json({ ok: false, error: 'auth_not_configured' }, 503);
  }

  const ipHash = await clientIpHash(request);
  if (env.DB && ipHash) {
    const locked = await isLoginLocked(env, ipHash);
    if (locked) {
      await sleep(800);
      return json({ ok: false, error: 'too_many_attempts' }, 429);
    }
  }

  const got = await sha256Hex(password);
  let matched = false;
  for (const expected of hashes) {
    if (timingSafeEqual(got, expected)) {
      matched = true;
      break;
    }
  }

  if (!matched) {
    if (env.DB && ipHash) await recordLoginFail(env, ipHash);
    await sleep(600);
    return json({ ok: false, error: 'invalid_credentials' }, 401);
  }

  if (env.DB && ipHash) await clearLoginFails(env, ipHash);
  const cookie = await createSessionCookie(env);
  return json({ ok: true }, 200, { 'set-cookie': cookie });
}

async function clientIpHash(request) {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '';
  if (!ip) return '';
  return sha256Hex(ip);
}

async function isLoginLocked(env, ipHash) {
  try {
    const row = await env.DB.prepare(
      'SELECT fails, locked_until FROM admin_login_attempts WHERE ip_hash = ?'
    )
      .bind(ipHash)
      .first();
    if (!row) return false;
    if (row.locked_until && Date.parse(row.locked_until) > Date.now()) return true;
    return false;
  } catch {
    return false;
  }
}

async function recordLoginFail(env, ipHash) {
  try {
    const row = await env.DB.prepare(
      'SELECT fails FROM admin_login_attempts WHERE ip_hash = ?'
    )
      .bind(ipHash)
      .first();
    const fails = Number(row?.fails || 0) + 1;
    const lockedUntil =
      fails >= LOGIN_MAX_FAILS
        ? new Date(Date.now() + LOGIN_LOCK_MS).toISOString()
        : null;
    await env.DB.prepare(
      `INSERT INTO admin_login_attempts (ip_hash, fails, locked_until)
       VALUES (?, ?, ?)
       ON CONFLICT(ip_hash) DO UPDATE SET fails = excluded.fails, locked_until = excluded.locked_until`
    )
      .bind(ipHash, fails, lockedUntil)
      .run();
  } catch (err) {
    console.error('login fail track error', err);
  }
}

async function clearLoginFails(env, ipHash) {
  try {
    await env.DB.prepare('DELETE FROM admin_login_attempts WHERE ip_hash = ?')
      .bind(ipHash)
      .run();
  } catch {
    /* ignore */
  }
}

function handleLogout() {
  const cookie = `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
  return json({ ok: true }, 200, { 'set-cookie': cookie });
}

async function handleListLeads(request, env, url) {
  if (!(await verifySession(request, env))) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  if (!env.DB) return json({ ok: false, error: 'storage_unavailable' }, 503);

  const type = url.searchParams.get('type');
  const limit = clamp(Number(url.searchParams.get('limit')) || 200, 1, 1000);

  const query = type
    ? env.DB.prepare(
        'SELECT * FROM leads WHERE type = ? ORDER BY created_at DESC LIMIT ?'
      ).bind(type, limit)
    : env.DB.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT ?').bind(limit);

  const { results } = await query.all();
  const leads = (results || []).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    type: row.type,
    name: row.name,
    email: row.email,
    phone: row.phone,
    meta: row.meta,
    status: row.status,
    data: safeParse(row.payload),
  }));

  return json({ ok: true, count: leads.length, leads });
}

/* ---------------------------------------------------------------- session */

async function createSessionCookie(env) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const signature = await hmacHex(sessionSecret(env), String(expiresAt));
  const value = `${expiresAt}.${signature}`;
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return `${SESSION_COOKIE}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

async function verifySession(request, env) {
  const raw = readCookie(request, SESSION_COOKIE);
  if (!raw) return false;

  const [expiresAt, signature] = raw.split('.');
  if (!expiresAt || !signature) return false;
  if (!Number(expiresAt) || Number(expiresAt) < Date.now()) return false;

  const expected = await hmacHex(sessionSecret(env), expiresAt);
  return timingSafeEqual(signature, expected);
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
}

/* ---------------------------------------------------------------- helpers */

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });
}

async function readJson(request) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) return null;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return null;
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function sanitizeObject(input, depth = 0) {
  if (depth > 4) return {};
  const out = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') out[key] = truncate(value.trim(), MAX_FIELD_LENGTH);
    else if (typeof value === 'number' || typeof value === 'boolean') out[key] = value;
    else if (Array.isArray(value)) {
      out[key] = value
        .slice(0, 50)
        .map((v) => (typeof v === 'object' && v ? sanitizeObject(v, depth + 1) : v));
    } else if (value && typeof value === 'object') {
      out[key] = sanitizeObject(value, depth + 1);
    }
  }
  return out;
}

function pickField(data, keys) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) return truncate(value.trim(), 300);
  }
  return null;
}

function truncate(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hashIp(request, env) {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  // Salted so the table never holds a reversible address.
  return sha256Hex(`${ip}:${sessionSecret(env)}`);
}

async function sha256Hex(value) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return toHex(buf);
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toHex(sig);
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
