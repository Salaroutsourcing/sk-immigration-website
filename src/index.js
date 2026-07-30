/**
 * SK Immigration Services — Worker API
 *
 * Static site via ASSETS + /api/* for leads, admin CRM, blog/jobs CMS.
 */

const SESSION_COOKIE = 'sk_admin';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 512 * 1024;
const MAX_FIELD_LENGTH = 8000;
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_MAX_FAILS = 8;
const LOGIN_LOCK_MS = 15 * 60 * 1000;

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

const LEAD_STATUSES = new Set([
  'new',
  'contacted',
  'in_progress',
  'won',
  'lost',
  'archived',
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

    if (url.hostname === 'salaroutsourcing.com') {
      url.hostname = 'www.salaroutsourcing.com';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    // Do NOT redirect /answers ↔ /answers.html — Cloudflare Assets already
    // serves answers.html at /answers; redirecting creates a loop.

    // Canonical Schengen appointment page (dedupe thin alias)
    if (
      url.pathname === '/visa-appointment/schengen-appointment-pakistan' ||
      url.pathname === '/visa-appointment/schengen-appointment-pakistan/'
    ) {
      return Response.redirect(
        new URL('/visa-appointment/schengen-visa-appointment-pakistan/', url).toString(),
        301
      );
    }

    // Prefer extensionless Answers hub URL
    if (url.pathname === '/answers.html' || url.pathname === '/answers/') {
      return Response.redirect(new URL('/answers', url).toString(), 301);
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

  /* Public CMS reads */
  if (pathname === '/api/blog' && method === 'GET') {
    return handlePublicBlogList(env, url);
  }
  if (pathname.startsWith('/api/blog/') && method === 'GET') {
    return handlePublicBlogGet(env, pathname.slice('/api/blog/'.length));
  }
  if (pathname === '/api/jobs' && method === 'GET') {
    return handlePublicJobsList(env);
  }

  /* Admin auth */
  if (pathname === '/api/admin/login' && method === 'POST') {
    return handleLogin(request, env);
  }
  if (pathname === '/api/admin/logout' && method === 'POST') {
    return handleLogout();
  }
  if (pathname === '/api/admin/session' && method === 'GET') {
    return json({ ok: true, authenticated: await verifySession(request, env) });
  }

  /* Admin leads */
  if (pathname === '/api/admin/leads' && method === 'GET') {
    return handleListLeads(request, env, url);
  }
  const leadMatch = pathname.match(/^\/api\/admin\/leads\/([^/]+)(?:\/(notes))?$/);
  if (leadMatch) {
    const leadId = decodeURIComponent(leadMatch[1]);
    const isNotes = leadMatch[2] === 'notes';
    if (isNotes && method === 'POST') return handleAddLeadNote(request, env, leadId);
    if (!isNotes && method === 'GET') return handleGetLead(request, env, leadId);
    if (!isNotes && method === 'PATCH') return handlePatchLead(request, env, leadId);
  }

  /* Admin blog */
  if (pathname === '/api/admin/blog' && method === 'GET') {
    return handleAdminBlogList(request, env);
  }
  if (pathname === '/api/admin/blog' && method === 'POST') {
    return handleAdminBlogSave(request, env, null);
  }
  const blogMatch = pathname.match(/^\/api\/admin\/blog\/([^/]+)$/);
  if (blogMatch) {
    const id = decodeURIComponent(blogMatch[1]);
    if (method === 'PUT') return handleAdminBlogSave(request, env, id);
    if (method === 'DELETE') return handleAdminBlogDelete(request, env, id);
  }

  /* Admin jobs */
  if (pathname === '/api/admin/jobs' && method === 'GET') {
    return handleAdminJobsList(request, env);
  }
  if (pathname === '/api/admin/jobs' && method === 'POST') {
    return handleAdminJobSave(request, env, null);
  }
  const jobMatch = pathname.match(/^\/api\/admin\/jobs\/([^/]+)$/);
  if (jobMatch) {
    const id = decodeURIComponent(jobMatch[1]);
    if (method === 'PUT') return handleAdminJobSave(request, env, id);
    if (method === 'DELETE') return handleAdminJobDelete(request, env, id);
  }

  return json({ ok: false, error: 'not_found' }, 404);
}

/* ------------------------------------------------------------------ leads */

async function handleLead(request, env, ctx) {
  if (!env.DB) return json({ ok: false, error: 'storage_unavailable' }, 503);

  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'invalid_json' }, 400);

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

  const now = new Date().toISOString();
  const lead = {
    id: crypto.randomUUID(),
    createdAt: now,
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
    `INSERT INTO leads (id, created_at, updated_at, type, name, email, phone, meta, payload, ip_hash, user_agent, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`
  )
    .bind(
      lead.id,
      lead.createdAt,
      now,
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

/* ------------------------------------------------------------------ admin auth */

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
  if (!secret) throw new Error('SESSION_SECRET is not configured');
  return secret;
}

async function requireAdmin(request, env) {
  if (!(await verifySession(request, env))) return null;
  if (!env.DB) return 'no_db';
  return true;
}

async function handleLogin(request, env) {
  const body = await readJson(request);
  const password = body && typeof body.password === 'string' ? body.password : '';
  if (!password) return json({ ok: false, error: 'password_required' }, 400);

  const hashes = adminPasswordHashes(env);
  if (!hashes.size) return json({ ok: false, error: 'auth_not_configured' }, 503);

  const ipHash = await clientIpHash(request);
  if (env.DB && ipHash && (await isLoginLocked(env, ipHash))) {
    await sleep(800);
    return json({ ok: false, error: 'too_many_attempts' }, 429);
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
  return json({ ok: true }, 200, { 'set-cookie': await createSessionCookie(env) });
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
    return Boolean(row.locked_until && Date.parse(row.locked_until) > Date.now());
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

/* ------------------------------------------------------------------ admin leads */

function mapLead(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at || null,
    type: row.type,
    name: row.name,
    email: row.email,
    phone: row.phone,
    meta: row.meta,
    status: row.status || 'new',
    data: safeParse(row.payload),
  };
}

async function handleListLeads(request, env, url) {
  const gate = await requireAdmin(request, env);
  if (gate === null) return json({ ok: false, error: 'unauthorized' }, 401);
  if (gate === 'no_db') return json({ ok: false, error: 'storage_unavailable' }, 503);

  const type = url.searchParams.get('type');
  const status = url.searchParams.get('status');
  const limit = clamp(Number(url.searchParams.get('limit')) || 200, 1, 1000);

  let sql = 'SELECT * FROM leads';
  const binds = [];
  const where = [];
  if (type) {
    where.push('type = ?');
    binds.push(type);
  }
  if (status) {
    where.push('status = ?');
    binds.push(status);
  }
  if (where.length) sql += ` WHERE ${where.join(' AND ')}`;
  sql += ' ORDER BY created_at DESC LIMIT ?';
  binds.push(limit);

  const { results } = await env.DB.prepare(sql)
    .bind(...binds)
    .all();
  const leads = (results || []).map(mapLead);

  const counts = { new: 0, contacted: 0, in_progress: 0, won: 0, lost: 0, archived: 0 };
  for (const l of leads) {
    if (counts[l.status] !== undefined) counts[l.status] += 1;
  }

  return json({ ok: true, count: leads.length, counts, leads });
}

async function handleGetLead(request, env, id) {
  const gate = await requireAdmin(request, env);
  if (gate === null) return json({ ok: false, error: 'unauthorized' }, 401);
  if (gate === 'no_db') return json({ ok: false, error: 'storage_unavailable' }, 503);

  const row = await env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(id).first();
  if (!row) return json({ ok: false, error: 'not_found' }, 404);

  const { results: notes } = await env.DB.prepare(
    'SELECT id, body, created_at FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC LIMIT 100'
  )
    .bind(id)
    .all();

  return json({
    ok: true,
    lead: mapLead(row),
    notes: (notes || []).map((n) => ({
      id: n.id,
      body: n.body,
      createdAt: n.created_at,
    })),
  });
}

async function handlePatchLead(request, env, id) {
  const gate = await requireAdmin(request, env);
  if (gate === null) return json({ ok: false, error: 'unauthorized' }, 401);
  if (gate === 'no_db') return json({ ok: false, error: 'storage_unavailable' }, 503);

  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'invalid_json' }, 400);

  const row = await env.DB.prepare('SELECT id FROM leads WHERE id = ?').bind(id).first();
  if (!row) return json({ ok: false, error: 'not_found' }, 404);

  if (typeof body.status === 'string') {
    const status = body.status.toLowerCase();
    if (!LEAD_STATUSES.has(status)) {
      return json({ ok: false, error: 'invalid_status' }, 400);
    }
    const now = new Date().toISOString();
    await env.DB.prepare('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?')
      .bind(status, now, id)
      .run();
  }

  return handleGetLead(request, env, id);
}

async function handleAddLeadNote(request, env, leadId) {
  const gate = await requireAdmin(request, env);
  if (gate === null) return json({ ok: false, error: 'unauthorized' }, 401);
  if (gate === 'no_db') return json({ ok: false, error: 'storage_unavailable' }, 503);

  const body = await readJson(request);
  const text =
    body && typeof body.body === 'string' ? truncate(body.body.trim(), 4000) : '';
  if (!text) return json({ ok: false, error: 'body_required' }, 400);

  const row = await env.DB.prepare('SELECT id FROM leads WHERE id = ?').bind(leadId).first();
  if (!row) return json({ ok: false, error: 'not_found' }, 404);

  const now = new Date().toISOString();
  const noteId = crypto.randomUUID();
  await env.DB.prepare(
    'INSERT INTO lead_notes (id, lead_id, body, created_at) VALUES (?, ?, ?, ?)'
  )
    .bind(noteId, leadId, text, now)
    .run();
  await env.DB.prepare('UPDATE leads SET updated_at = ? WHERE id = ?')
    .bind(now, leadId)
    .run();

  return handleGetLead(request, env, leadId);
}

/* ------------------------------------------------------------------ public CMS */

function mapBlog(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    category: row.category || '',
    tags: safeParseArray(row.tags),
    author: row.author || 'SK Immigration',
    date: row.date || '',
    featured: Boolean(row.featured),
    published: row.published === undefined ? true : Boolean(row.published),
    content: row.content || '',
    url: row.url || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapJob(row) {
  return {
    id: row.id,
    title: row.title,
    company: row.company || '',
    country: row.country || '',
    city: row.city || '',
    type: row.type || '',
    category: row.category || '',
    salary: row.salary || '',
    language: row.language || '',
    featured: Boolean(row.featured),
    published: row.published === undefined ? true : Boolean(row.published),
    description: row.description || '',
    requirements: safeParseArray(row.requirements),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function handlePublicBlogList(env, url) {
  if (!env.DB) return json({ ok: true, posts: [], source: 'empty' });
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, slug, title, excerpt, category, tags, author, date, featured, published, url, created_at, updated_at
       FROM blog_posts WHERE published = 1 ORDER BY date DESC LIMIT 200`
    ).all();
    const posts = (results || []).map((row) => {
      const p = mapBlog(row);
      delete p.content;
      return p;
    });
    return json({ ok: true, posts, source: 'd1' });
  } catch (err) {
    console.error('public blog list', err);
    return json({ ok: true, posts: [], source: 'error' });
  }
}

async function handlePublicBlogGet(env, slugOrId) {
  if (!env.DB) return json({ ok: false, error: 'not_found' }, 404);
  const key = decodeURIComponent(slugOrId);
  try {
    const row = await env.DB.prepare(
      'SELECT * FROM blog_posts WHERE (slug = ? OR id = ?) AND published = 1 LIMIT 1'
    )
      .bind(key, key)
      .first();
    if (!row) return json({ ok: false, error: 'not_found' }, 404);
    return json({ ok: true, post: mapBlog(row) });
  } catch (err) {
    console.error('public blog get', err);
    return json({ ok: false, error: 'not_found' }, 404);
  }
}

async function handlePublicJobsList(env) {
  if (!env.DB) return json({ ok: true, jobs: [], source: 'empty' });
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM jobs WHERE published = 1 ORDER BY featured DESC, updated_at DESC LIMIT 200'
    ).all();
    return json({ ok: true, jobs: (results || []).map(mapJob), source: 'd1' });
  } catch (err) {
    console.error('public jobs list', err);
    return json({ ok: true, jobs: [], source: 'error' });
  }
}

/* ------------------------------------------------------------------ admin CMS */

async function handleAdminBlogList(request, env) {
  const gate = await requireAdmin(request, env);
  if (gate === null) return json({ ok: false, error: 'unauthorized' }, 401);
  if (gate === 'no_db') return json({ ok: false, error: 'storage_unavailable' }, 503);

  const { results } = await env.DB.prepare(
    'SELECT * FROM blog_posts ORDER BY date DESC LIMIT 500'
  ).all();
  return json({ ok: true, posts: (results || []).map(mapBlog) });
}

async function handleAdminBlogSave(request, env, existingId) {
  const gate = await requireAdmin(request, env);
  if (gate === null) return json({ ok: false, error: 'unauthorized' }, 401);
  if (gate === 'no_db') return json({ ok: false, error: 'storage_unavailable' }, 503);

  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'invalid_json' }, 400);

  const title = typeof body.title === 'string' ? truncate(body.title.trim(), 300) : '';
  const slugRaw = typeof body.slug === 'string' ? body.slug.trim() : '';
  const slug = slugify(slugRaw || title);
  if (!title || !slug) return json({ ok: false, error: 'title_required' }, 400);

  const now = new Date().toISOString();
  const id = existingId || (typeof body.id === 'string' && body.id.trim()) || crypto.randomUUID();
  const post = {
    id,
    slug,
    title,
    excerpt: truncate(String(body.excerpt || ''), 2000),
    category: truncate(String(body.category || 'Guides'), 120),
    tags: JSON.stringify(Array.isArray(body.tags) ? body.tags.slice(0, 20) : []),
    author: truncate(String(body.author || 'SK Immigration'), 120),
    date: truncate(String(body.date || now.slice(0, 10)), 32),
    featured: body.featured ? 1 : 0,
    published: body.published === false ? 0 : 1,
    content: truncate(String(body.content || ''), 200000),
    url: truncate(String(body.url || `blog-post.html?slug=${encodeURIComponent(slug)}`), 500),
  };

  if (existingId) {
    const exists = await env.DB.prepare('SELECT id FROM blog_posts WHERE id = ?')
      .bind(existingId)
      .first();
    if (!exists) return json({ ok: false, error: 'not_found' }, 404);
    await env.DB.prepare(
      `UPDATE blog_posts SET slug=?, title=?, excerpt=?, category=?, tags=?, author=?, date=?,
       featured=?, published=?, content=?, url=?, updated_at=? WHERE id=?`
    )
      .bind(
        post.slug,
        post.title,
        post.excerpt,
        post.category,
        post.tags,
        post.author,
        post.date,
        post.featured,
        post.published,
        post.content,
        post.url,
        now,
        existingId
      )
      .run();
  } else {
    await env.DB.prepare(
      `INSERT INTO blog_posts (id, slug, title, excerpt, category, tags, author, date, featured, published, content, url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        post.id,
        post.slug,
        post.title,
        post.excerpt,
        post.category,
        post.tags,
        post.author,
        post.date,
        post.featured,
        post.published,
        post.content,
        post.url,
        now,
        now
      )
      .run();
  }

  const row = await env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first();
  return json({ ok: true, post: mapBlog(row) });
}

async function handleAdminBlogDelete(request, env, id) {
  const gate = await requireAdmin(request, env);
  if (gate === null) return json({ ok: false, error: 'unauthorized' }, 401);
  if (gate === 'no_db') return json({ ok: false, error: 'storage_unavailable' }, 503);

  await env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

async function handleAdminJobsList(request, env) {
  const gate = await requireAdmin(request, env);
  if (gate === null) return json({ ok: false, error: 'unauthorized' }, 401);
  if (gate === 'no_db') return json({ ok: false, error: 'storage_unavailable' }, 503);

  const { results } = await env.DB.prepare(
    'SELECT * FROM jobs ORDER BY featured DESC, updated_at DESC LIMIT 500'
  ).all();
  return json({ ok: true, jobs: (results || []).map(mapJob) });
}

async function handleAdminJobSave(request, env, existingId) {
  const gate = await requireAdmin(request, env);
  if (gate === null) return json({ ok: false, error: 'unauthorized' }, 401);
  if (gate === 'no_db') return json({ ok: false, error: 'storage_unavailable' }, 503);

  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'invalid_json' }, 400);

  const title = typeof body.title === 'string' ? truncate(body.title.trim(), 300) : '';
  if (!title) return json({ ok: false, error: 'title_required' }, 400);

  const now = new Date().toISOString();
  const id = existingId || (typeof body.id === 'string' && body.id.trim()) || crypto.randomUUID();
  const reqs = Array.isArray(body.requirements)
    ? body.requirements.map((r) => String(r).slice(0, 300)).slice(0, 40)
    : String(body.requirements || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 40);

  const job = {
    id,
    title,
    company: truncate(String(body.company || ''), 200),
    country: truncate(String(body.country || ''), 120),
    city: truncate(String(body.city || ''), 120),
    type: truncate(String(body.type || 'Ausbildung'), 80),
    category: truncate(String(body.category || ''), 120),
    salary: truncate(String(body.salary || ''), 200),
    language: truncate(String(body.language || ''), 120),
    featured: body.featured ? 1 : 0,
    published: body.published === false ? 0 : 1,
    description: truncate(String(body.description || ''), 8000),
    requirements: JSON.stringify(reqs),
  };

  if (existingId) {
    const exists = await env.DB.prepare('SELECT id FROM jobs WHERE id = ?')
      .bind(existingId)
      .first();
    if (!exists) return json({ ok: false, error: 'not_found' }, 404);
    await env.DB.prepare(
      `UPDATE jobs SET title=?, company=?, country=?, city=?, type=?, category=?, salary=?, language=?,
       featured=?, published=?, description=?, requirements=?, updated_at=? WHERE id=?`
    )
      .bind(
        job.title,
        job.company,
        job.country,
        job.city,
        job.type,
        job.category,
        job.salary,
        job.language,
        job.featured,
        job.published,
        job.description,
        job.requirements,
        now,
        existingId
      )
      .run();
  } else {
    await env.DB.prepare(
      `INSERT INTO jobs (id, title, company, country, city, type, category, salary, language, featured, published, description, requirements, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        job.id,
        job.title,
        job.company,
        job.country,
        job.city,
        job.type,
        job.category,
        job.salary,
        job.language,
        job.featured,
        job.published,
        job.description,
        job.requirements,
        now,
        now
      )
      .run();
  }

  const row = await env.DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first();
  return json({ ok: true, job: mapJob(row) });
}

async function handleAdminJobDelete(request, env, id) {
  const gate = await requireAdmin(request, env);
  if (gate === null) return json({ ok: false, error: 'unauthorized' }, 401);
  if (gate === 'no_db') return json({ ok: false, error: 'storage_unavailable' }, 503);

  await env.DB.prepare('DELETE FROM jobs WHERE id = ?').bind(id).run();
  return json({ ok: true });
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
    if (typeof value === 'string') out[key] = truncate(value.trim(), Math.min(MAX_FIELD_LENGTH, 2000));
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
  const s = String(value ?? '');
  return s.length > max ? s.slice(0, max) : s;
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

function safeParseArray(text) {
  if (Array.isArray(text)) return text;
  try {
    const parsed = JSON.parse(text || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 120);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hashIp(request, env) {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
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
