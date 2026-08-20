/**
 * SK Immigration Studio — GitHub OAuth, D1 CMS, media, and GitHub publish.
 * Mounted from worker/index.js. Public pages stay static; Studio is the editor.
 */
const SESSION_COOKIE = "sk_studio";
const STATE_COOKIE = "sk_studio_oauth";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const MEDIA_MAX_BYTES = 4 * 1024 * 1024;
const JSON_MAX_BYTES = 2 * 1024 * 1024;
const DEFAULT_REPO = "Salaroutsourcing/sk-immigration-website";
const DEFAULT_BRANCH = "main";
const ALLOWED_COLLECTIONS = new Set(["news", "blog", "web-stories"]);
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

export function isStudioPath(pathname) {
  const p = String(pathname || "").toLowerCase();
  return p === "/studio" || p.startsWith("/studio/");
}

export function isStudioApi(pathname) {
  return (
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/studio/")
  );
}

export async function handleStudioRequest(request, env, ctx, helpers) {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS" && isStudioApi(pathname)) {
    return cors(request, new Response(null, { status: 204 }));
  }

  try {
    if (pathname === "/api/auth/github" && method === "GET") {
      return cors(request, await startGithubOAuth(url, env));
    }
    if (pathname === "/api/auth/github/callback" && method === "GET") {
      return await finishGithubOAuth(url, request, env);
    }
    if (pathname === "/api/auth/login" && method === "POST") {
      return cors(request, await passwordLogin(request, env, helpers));
    }
    if (pathname === "/api/auth/logout" && (method === "POST" || method === "GET")) {
      return cors(request, logoutResponse(url));
    }
    if (pathname === "/api/studio/me" && method === "GET") {
      return cors(request, await studioMe(request, env));
    }
    if (pathname === "/api/studio/dashboard" && method === "GET") {
      return cors(request, await requireStudio(request, env, dashboard));
    }
    if (pathname === "/api/studio/bootstrap" && method === "POST") {
      return cors(request, await requireStudio(request, env, bootstrapIfEmpty));
    }
    if (pathname === "/api/studio/entries" && method === "GET") {
      return cors(request, await requireStudio(request, env, listEntries));
    }
    if (pathname === "/api/studio/entries" && method === "POST") {
      return cors(request, await requireStudio(request, env, createEntry));
    }
    if (pathname.startsWith("/api/studio/entries/") && method === "GET") {
      return cors(request, await requireStudio(request, env, getEntry));
    }
    if (pathname.startsWith("/api/studio/entries/") && pathname.endsWith("/duplicate") && method === "POST") {
      return cors(request, await requireStudio(request, env, duplicateEntry));
    }
    if (pathname.startsWith("/api/studio/entries/") && pathname.endsWith("/publish") && method === "POST") {
      return cors(request, await requireStudio(request, env, publishEntry));
    }
    if (pathname.startsWith("/api/studio/entries/") && method === "PUT") {
      return cors(request, await requireStudio(request, env, updateEntry));
    }
    if (pathname.startsWith("/api/studio/entries/") && method === "DELETE") {
      return cors(request, await requireStudio(request, env, deleteEntry));
    }
    if (pathname === "/api/studio/media" && method === "GET") {
      return cors(request, await requireStudio(request, env, listMedia));
    }
    if (pathname === "/api/studio/media" && method === "POST") {
      return cors(request, await requireStudio(request, env, uploadMedia));
    }
    if (pathname.startsWith("/api/studio/media/") && method === "DELETE") {
      return cors(request, await requireStudio(request, env, deleteMedia));
    }
    if (pathname === "/api/studio/keywords" && method === "GET") {
      return cors(request, await requireStudio(request, env, listKeywords));
    }
    if (pathname === "/api/studio/keywords" && method === "POST") {
      return cors(request, await requireStudio(request, env, upsertKeyword));
    }
    if (pathname.startsWith("/api/studio/keywords/") && method === "DELETE") {
      return cors(request, await requireStudio(request, env, deleteKeyword));
    }
    if (pathname === "/api/studio/activity" && method === "GET") {
      return cors(request, await requireStudio(request, env, listActivity));
    }
    if (pathname === "/api/studio/settings" && method === "GET") {
      return cors(request, await requireStudio(request, env, studioSettings));
    }
    if (isStudioApi(pathname)) {
      return cors(request, json({ error: "Not found" }, 404));
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Studio error";
    const status = err.status || 500;
    return cors(request, json({ error: message }, status));
  }

  return null;
}

export async function studioAssetFallback(request, env) {
  const url = new URL(request.url);
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  if (!isStudioPath(url.pathname)) return null;
  if (/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.toLowerCase().endsWith(".html")) {
    return null;
  }

  const lowerPath = url.pathname.toLowerCase();
  if (url.pathname !== lowerPath || lowerPath === "/studio") {
    const dest = new URL(request.url);
    dest.pathname = lowerPath === "/studio" ? "/studio/" : lowerPath;
    if (dest.toString() !== url.toString()) {
      return Response.redirect(dest.toString(), 301);
    }
  }

  const tryUrls = ["/studio/", "/studio/index.html"];
  let res = null;
  for (const path of tryUrls) {
    res = await env.ASSETS.fetch(
      new Request(new URL(path, url.origin), {
        method: "GET",
        headers: request.headers,
        redirect: "manual",
      }),
    );
    if (res && res.status === 200) break;
  }
  if (!res || res.status !== 200) return null;

  const headers = new Headers(res.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.set("Cache-Control", "no-store");
  headers.delete("Location");
  return new Response(res.body, { status: 200, headers });
}

function cors(request, response) {
  const headers = new Headers(response.headers);
  const origin = request.headers.get("Origin");
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Headers", "content-type");
    headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  }
  return new Response(response.body, { status: response.status, headers });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

function cookieHeader(name, value, { maxAge, httpOnly = true, sameSite = "Lax" } = {}) {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "Secure",
    `SameSite=${sameSite}`,
  ];
  if (httpOnly) parts.push("HttpOnly");
  if (typeof maxAge === "number") parts.push(`Max-Age=${maxAge}`);
  return parts.join("; ");
}

function clearCookie(name) {
  return `${name}=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax`;
}

function getCookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  const parts = raw.split(/;\s*/);
  for (const part of parts) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    if (part.slice(0, i) === name) return part.slice(i + 1);
  }
  return "";
}

function b64url(bytes) {
  let bin = "";
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlFromString(str) {
  return b64url(new TextEncoder().encode(str));
}

function fromB64url(str) {
  const pad = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = pad + "=".repeat((4 - (pad.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function timingSafeEqualHex(a, b) {
  const aa = a.toLowerCase();
  const bb = b.toLowerCase();
  if (aa.length !== bb.length) return false;
  const left = new TextEncoder().encode(aa);
  const right = new TextEncoder().encode(bb);
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}

function sessionSecret(env) {
  return env.SESSION_SECRET || "";
}

async function signSession(env, payload) {
  const secret = sessionSecret(env);
  if (!secret) throw Object.assign(new Error("SESSION_SECRET is not configured"), { status: 500 });
  const body = b64urlFromString(JSON.stringify(payload));
  const sig = await hmacHex(secret, body);
  return `${body}.${sig}`;
}

export async function readStudioSession(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token || !token.includes(".")) return null;
  const secret = sessionSecret(env);
  if (!secret) return null;
  const i = token.lastIndexOf(".");
  const body = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = await hmacHex(secret, body);
  if (!(await timingSafeEqualHex(sig, expected))) return null;
  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(fromB64url(body)));
  } catch {
    return null;
  }
  if (!payload?.exp || Date.now() > payload.exp) return null;
  return payload;
}

async function requireStudio(request, env, handler) {
  const session = await readStudioSession(request, env);
  if (!session) {
    return json({ error: "Unauthorized", login: true }, 401);
  }
  return handler(request, env, session);
}

function githubAllowlist(env) {
  return String(env.STUDIO_GITHUB_ALLOWLIST || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function repoInfo(env) {
  const repo = env.GITHUB_REPO || DEFAULT_REPO;
  const branch = env.STUDIO_PUBLISH_BRANCH || env.GITHUB_BRANCH || DEFAULT_BRANCH;
  return { repo, branch };
}

async function startGithubOAuth(url, env) {
  if (!sessionSecret(env)) {
    return json({ error: "SESSION_SECRET is not configured." }, 503);
  }
  const clientId = env.GITHUB_CLIENT_ID || "";
  const allow = githubAllowlist(env);
  if (!clientId || allow.length === 0) {
    return json(
      {
        error:
          "GitHub OAuth is not configured. Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and STUDIO_GITHUB_ALLOWLIST.",
      },
      503,
    );
  }
  const state = crypto.randomUUID();
  const exp = Date.now() + 10 * 60 * 1000;
  const signed = await hmacHex(sessionSecret(env), `${state}.${exp}`);
  const redirectUri = `${url.origin}/api/auth/github/callback`;
  const gh = new URL("https://github.com/login/oauth/authorize");
  gh.searchParams.set("client_id", clientId);
  gh.searchParams.set("redirect_uri", redirectUri);
  gh.searchParams.set("scope", "read:user public_repo");
  gh.searchParams.set("state", `${state}.${exp}.${signed}`);
  const res = new Response(null, { status: 302 });
  res.headers.set("Location", gh.toString());
  res.headers.append(
    "Set-Cookie",
    cookieHeader(STATE_COOKIE, `${state}.${exp}`, { maxAge: 600, sameSite: "Lax" }),
  );
  return res;
}

async function finishGithubOAuth(url, request, env) {
  const origin = url.origin;
  const fail = (reason) => {
    const res = new Response(null, { status: 302 });
    res.headers.set("Location", `${origin}/studio/login?error=${encodeURIComponent(reason)}`);
    res.headers.append("Set-Cookie", clearCookie(STATE_COOKIE));
    return res;
  };
  const code = url.searchParams.get("code") || "";
  const stateParam = url.searchParams.get("state") || "";
  const cookieState = getCookie(request, STATE_COOKIE);
  if (!code || !stateParam || !cookieState) return fail("oauth_state");
  const [state, expStr, sig] = stateParam.split(".");
  const [cState, cExp] = cookieState.split(".");
  if (state !== cState || expStr !== cExp) return fail("oauth_state");
  const exp = Number(expStr);
  if (!exp || Date.now() > exp) return fail("oauth_expired");
  const expected = await hmacHex(sessionSecret(env), `${state}.${exp}`);
  if (!(await timingSafeEqualHex(sig, expected))) return fail("oauth_state");

  const clientId = env.GITHUB_CLIENT_ID || "";
  const clientSecret = env.GITHUB_CLIENT_SECRET || "";
  if (!clientId || !clientSecret) return fail("oauth_config");

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${origin}/api/auth/github/callback`,
    }),
  });
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token;
  if (!accessToken) return fail("oauth_token");

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "sk-immigration-studio",
    },
  });
  if (!userRes.ok) return fail("oauth_user");
  const user = await userRes.json();
  const login = String(user.login || "").toLowerCase();
  const allow = githubAllowlist(env);
  if (!allow.includes(login)) return fail("not_allowlisted");

  const session = await signSession(env, {
    exp: Date.now() + SESSION_TTL_MS,
    login: user.login,
    name: user.name || user.login,
    avatar: user.avatar_url || "",
    method: "github",
    gh: accessToken,
  });
  const res = new Response(null, { status: 302 });
  res.headers.set("Location", `${origin}/studio/`);
  res.headers.append("Set-Cookie", clearCookie(STATE_COOKIE));
  res.headers.append(
    "Set-Cookie",
    cookieHeader(SESSION_COOKIE, session, { maxAge: SESSION_TTL_MS / 1000, sameSite: "Lax" }),
  );
  return res;
}

async function passwordLogin(request, env, helpers) {
  const hashes = helpers?.adminPasswordHashes?.(env);
  const hashSet = hashes instanceof Set ? hashes : new Set();
  if (!hashSet.size) {
    return json({ error: "Password login is disabled. Use GitHub OAuth." }, 403);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const password = typeof body.password === "string" ? body.password : "";
  const ipHash = helpers?.clientIpHash ? await helpers.clientIpHash(request) : "";
  if (env.DB && ipHash && helpers?.isLoginLocked && (await helpers.isLoginLocked(env, ipHash))) {
    if (helpers.sleep) await helpers.sleep(800);
    return json({ error: "Too many attempts. Try again later." }, 429);
  }
  const got = helpers?.sha256Hex ? await helpers.sha256Hex(password) : await sha256HexLocal(password);
  let matched = false;
  for (const expected of hashSet) {
    const equal = helpers?.timingSafeEqual
      ? helpers.timingSafeEqual(got, expected)
      : await timingSafeEqualHex(got, expected);
    if (equal) {
      matched = true;
      break;
    }
  }
  if (!matched) {
    if (env.DB && ipHash && helpers?.recordLoginFail) await helpers.recordLoginFail(env, ipHash);
    if (helpers?.sleep) await helpers.sleep(600);
    return json({ error: "Invalid password" }, 401);
  }
  if (env.DB && ipHash && helpers?.clearLoginFails) await helpers.clearLoginFails(env, ipHash);
  const session = await signSession(env, {
    exp: Date.now() + SESSION_TTL_MS,
    login: "admin",
    name: "Studio Admin",
    avatar: "",
    method: "password",
  });
  const res = json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    cookieHeader(SESSION_COOKIE, session, { maxAge: SESSION_TTL_MS / 1000, sameSite: "Lax" }),
  );
  return res;
}

async function sha256HexLocal(value) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function logoutResponse(url) {
  const res = url.pathname === "/api/auth/logout" && url.searchParams.get("redirect")
    ? new Response(null, { status: 302 })
    : json({ ok: true });
  if (res.status === 302) res.headers.set("Location", `${url.origin}/studio/login`);
  res.headers.append("Set-Cookie", clearCookie(SESSION_COOKIE));
  res.headers.append("Set-Cookie", clearCookie(STATE_COOKIE));
  return res;
}

async function studioMe(request, env) {
  const session = await readStudioSession(request, env);
  const allow = githubAllowlist(env);
  return json({
    user: session
      ? { login: session.login, name: session.name, avatar: session.avatar, method: session.method }
      : null,
    auth: {
      githubConfigured: Boolean(env.GITHUB_CLIENT_ID) && allow.length > 0,
      passwordConfigured: Boolean(env.ADMIN_PASSWORD_HASH),
      publishConfigured: Boolean(session?.gh) || Boolean(env.GITHUB_TOKEN),
    },
  });
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

async function dashboard(request, env, session) {
  await ensureTables(env);
  await bootstrapIfEmptyInner(env, session, false);
  const today = todayUtc();
  const rows = env.DB
    ? (
        await env.DB.prepare(
          `SELECT collection, status, date(published_at) as pubday, date(created_at) as createday
           FROM studio_entries`,
        ).all()
      ).results || []
    : [];
  const counts = {
    news: { today: 0, published: 0, drafts: 0, total: 0 },
    blog: { today: 0, published: 0, drafts: 0, total: 0 },
    "web-stories": { today: 0, published: 0, drafts: 0, total: 0 },
  };
  for (const row of rows) {
    const bucket = counts[row.collection];
    if (!bucket) continue;
    bucket.total += 1;
    if (row.status === "published") bucket.published += 1;
    if (row.status === "draft") bucket.drafts += 1;
    if (row.pubday === today || (row.status !== "published" && row.createday === today)) {
      bucket.today += 1;
    }
  }
  const recent = env.DB
    ? (
        await env.DB.prepare(
          `SELECT id, collection, slug, title, status, updated_at, published_at
           FROM studio_entries ORDER BY updated_at DESC LIMIT 12`,
        ).all()
      ).results || []
    : [];
  const keywords = env.DB
    ? (await env.DB.prepare(`SELECT keyword, cluster, status FROM studio_keywords ORDER BY keyword LIMIT 12`).all())
        .results || []
    : [];
  const activity = env.DB
    ? (
        await env.DB.prepare(
          `SELECT action, collection, actor, detail, created_at FROM studio_activity ORDER BY created_at DESC LIMIT 8`,
        ).all()
      ).results || []
    : [];
  return json({
    today,
    targets: { news: 5, "web-stories": 5, blog: 1 },
    counts,
    recent,
    keywords,
    activity,
    user: { login: session.login, name: session.name, avatar: session.avatar, method: session.method },
  });
}

async function listEntries(request, env) {
  await ensureTables(env);
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection") || "";
  const status = url.searchParams.get("status") || "";
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  let sql = `SELECT id, collection, slug, title, status, github_path, published_at, created_at, updated_at, created_by, updated_by FROM studio_entries`;
  const where = [];
  const binds = [];
  if (ALLOWED_COLLECTIONS.has(collection)) {
    where.push("collection = ?");
    binds.push(collection);
  }
  if (status && ["draft", "published", "scheduled"].includes(status)) {
    where.push("status = ?");
    binds.push(status);
  }
  if (where.length) sql += ` WHERE ${where.join(" AND ")}`;
  sql += " ORDER BY updated_at DESC LIMIT 200";
  const rows = env.DB ? (await env.DB.prepare(sql).bind(...binds).all()).results || [] : [];
  const filtered = q
    ? rows.filter((r) => `${r.title} ${r.slug}`.toLowerCase().includes(q))
    : rows;
  return json({ entries: filtered });
}

function entryIdFromPath(pathname, suffix = "") {
  const base = pathname.slice("/api/studio/entries/".length);
  const id = suffix ? base.slice(0, -suffix.length) : base;
  return decodeURIComponent(id.replace(/\/$/, ""));
}

async function getEntry(request, env) {
  const id = entryIdFromPath(new URL(request.url).pathname);
  const row = await getEntryRow(env, id);
  if (!row) return json({ error: "Not found" }, 404);
  return json({ entry: hydrateEntry(row) });
}

async function createEntry(request, env, session) {
  await ensureTables(env);
  const body = await readJson(request, JSON_MAX_BYTES);
  const collection = String(body.collection || "");
  if (!ALLOWED_COLLECTIONS.has(collection)) return json({ error: "Invalid collection" }, 400);
  const data = sanitizeData(collection, body.data || {});
  const slug = slugify(body.slug || data.slug || data.title || "untitled");
  data.slug = slug;
  const title = String(data.title || body.title || "Untitled");
  data.title = title;
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const existing = await env.DB.prepare(
    `SELECT id FROM studio_entries WHERE collection = ? AND slug = ?`,
  )
    .bind(collection, slug)
    .first();
  if (existing) return json({ error: "Slug already exists in this collection" }, 409);
  await env.DB.prepare(
    `INSERT INTO studio_entries (id, collection, slug, title, status, data_json, body, created_at, updated_at, created_by, updated_by)
     VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, collection, slug, title, JSON.stringify(data), String(body.body || ""), now, now, session.login, session.login)
    .run();
  await logActivity(env, {
    action: "create",
    collection,
    entry_id: id,
    actor: session.login,
    detail: title,
  });
  const row = await getEntryRow(env, id);
  return json({ entry: hydrateEntry(row) }, 201);
}

async function updateEntry(request, env, session) {
  const id = entryIdFromPath(new URL(request.url).pathname);
  const row = await getEntryRow(env, id);
  if (!row) return json({ error: "Not found" }, 404);
  const body = await readJson(request, JSON_MAX_BYTES);
  const data = sanitizeData(row.collection, body.data || JSON.parse(row.data_json));
  const slug = slugify(body.slug || data.slug || row.slug);
  data.slug = slug;
  const title = String(data.title || body.title || row.title);
  data.title = title;
  const status = ["draft", "published", "scheduled"].includes(body.status) ? body.status : row.status;
  const contentBody = body.body !== undefined ? String(body.body) : row.body;
  const now = new Date().toISOString();
  if (slug !== row.slug) {
    const clash = await env.DB.prepare(
      `SELECT id FROM studio_entries WHERE collection = ? AND slug = ? AND id != ?`,
    )
      .bind(row.collection, slug, id)
      .first();
    if (clash) return json({ error: "Slug already exists in this collection" }, 409);
  }
  await env.DB.prepare(
    `UPDATE studio_entries SET slug = ?, title = ?, status = ?, data_json = ?, body = ?, updated_at = ?, updated_by = ? WHERE id = ?`,
  )
    .bind(slug, title, status, JSON.stringify(data), contentBody, now, session.login, id)
    .run();
  await logActivity(env, {
    action: "update",
    collection: row.collection,
    entry_id: id,
    actor: session.login,
    detail: title,
  });
  return json({ entry: hydrateEntry(await getEntryRow(env, id)) });
}

async function deleteEntry(request, env, session) {
  const id = entryIdFromPath(new URL(request.url).pathname);
  const row = await getEntryRow(env, id);
  if (!row) return json({ error: "Not found" }, 404);
  await env.DB.prepare(`DELETE FROM studio_entries WHERE id = ?`).bind(id).run();
  await logActivity(env, {
    action: "delete",
    collection: row.collection,
    entry_id: id,
    actor: session.login,
    detail: row.title,
  });
  return json({ ok: true });
}

async function duplicateEntry(request, env, session) {
  const id = entryIdFromPath(new URL(request.url).pathname, "/duplicate");
  const row = await getEntryRow(env, id);
  if (!row) return json({ error: "Not found" }, 404);
  const data = JSON.parse(row.data_json);
  const baseSlug = `${row.slug}-copy`;
  let slug = baseSlug;
  let n = 2;
  while (
    await env.DB.prepare(`SELECT id FROM studio_entries WHERE collection = ? AND slug = ?`)
      .bind(row.collection, slug)
      .first()
  ) {
    slug = `${baseSlug}-${n++}`;
  }
  data.slug = slug;
  data.title = `${row.title} (copy)`;
  data.draft = true;
  data.publishDate = new Date().toISOString().slice(0, 10);
  data.featured = false;
  const now = new Date().toISOString();
  const newId = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO studio_entries (id, collection, slug, title, status, data_json, body, created_at, updated_at, created_by, updated_by)
     VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?)`,
  )
    .bind(newId, row.collection, slug, data.title, JSON.stringify(data), row.body, now, now, session.login, session.login)
    .run();
  await logActivity(env, {
    action: "duplicate",
    collection: row.collection,
    entry_id: newId,
    actor: session.login,
    detail: `${row.title} → ${data.title}`,
  });
  return json({ entry: hydrateEntry(await getEntryRow(env, newId)) }, 201);
}

async function publishEntry(request, env, session) {
  const id = entryIdFromPath(new URL(request.url).pathname, "/publish");
  const row = await getEntryRow(env, id);
  if (!row) return json({ error: "Not found" }, 404);
  const token = session.gh || env.GITHUB_TOKEN || "";
  const data = JSON.parse(row.data_json);
  const mdx = serializeMdx(row.collection, data, row.body);
  const folder = row.collection === "web-stories" ? "web-stories" : row.collection;
  const path = `src/content/${folder}/${row.slug}.mdx`;
  const now = new Date().toISOString();
  data.draft = false;
  if (!data.publishDate) data.publishDate = now.slice(0, 10);
  let githubSha = row.github_sha || null;
  if (token) {
    const result = await putGithubFile(env, token, path, mdx, `studio: publish ${folder}/${row.slug}`, githubSha);
    githubSha = result.sha;
  }
  await env.DB.prepare(
    `UPDATE studio_entries SET status = 'published', data_json = ?, published_at = ?, github_path = ?, github_sha = ?, updated_at = ?, updated_by = ? WHERE id = ?`,
  )
    .bind(JSON.stringify(data), now, path, githubSha, now, session.login, id)
    .run();
  await logActivity(env, {
    action: "publish",
    collection: row.collection,
    entry_id: id,
    actor: session.login,
    detail: token ? `Wrote ${path}` : "Saved as published in Studio (GitHub token missing)",
  });
  return json({
    entry: hydrateEntry(await getEntryRow(env, id)),
    publishedToGithub: Boolean(token),
    path,
  });
}

async function listMedia(request, env) {
  await ensureTables(env);
  const rows = env.DB
    ? (await env.DB.prepare(`SELECT * FROM studio_media ORDER BY created_at DESC LIMIT 200`).all()).results || []
    : [];
  return json({ media: rows });
}

async function uploadMedia(request, env, session) {
  await ensureTables(env);
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return json({ error: "Expected multipart upload" }, 400);
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return json({ error: "Missing file" }, 400);
  if (file.size > MEDIA_MAX_BYTES) return json({ error: "File too large (max 4MB)" }, 413);
  const mime = file.type || "application/octet-stream";
  if (!IMAGE_TYPES.has(mime)) return json({ error: "Only images are allowed" }, 415);
  const original = file.name || "upload";
  const ext = extFromName(original, mime);
  const filename = `${Date.now()}-${slugify(original.replace(/\.[^.]+$/, ""))}.${ext}`;
  const publicPath = `/uploads/${filename}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const token = session.gh || env.GITHUB_TOKEN || "";
  let githubSha = null;
  if (token) {
    const content = b64(bytes);
    const result = await putGithubFile(
      env,
      token,
      `public/uploads/${filename}`,
      content,
      `studio: upload ${filename}`,
      null,
      true,
    );
    githubSha = result.sha;
  }
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO studio_media (id, filename, original_name, mime_type, size_bytes, public_path, github_sha, alt, created_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, filename, original, mime, file.size, publicPath, githubSha, String(form.get("alt") || ""), now, session.login)
    .run();
  await logActivity(env, {
    action: "media.upload",
    actor: session.login,
    detail: original,
  });
  const row = await env.DB.prepare(`SELECT * FROM studio_media WHERE id = ?`).bind(id).first();
  return json({ media: row, storedInGithub: Boolean(token) }, 201);
}

async function deleteMedia(request, env, session) {
  const id = decodeURIComponent(new URL(request.url).pathname.slice("/api/studio/media/".length));
  const row = await env.DB.prepare(`SELECT * FROM studio_media WHERE id = ?`).bind(id).first();
  if (!row) return json({ error: "Not found" }, 404);
  await env.DB.prepare(`DELETE FROM studio_media WHERE id = ?`).bind(id).run();
  await logActivity(env, { action: "media.delete", actor: session.login, detail: row.filename });
  return json({ ok: true });
}

async function listKeywords(request, env) {
  await ensureTables(env);
  await seedKeywords(env);
  const rows = env.DB
    ? (await env.DB.prepare(`SELECT * FROM studio_keywords ORDER BY cluster, keyword`).all()).results || []
    : [];
  return json({ keywords: rows });
}

async function upsertKeyword(request, env) {
  await ensureTables(env);
  const body = await readJson(request);
  const keyword = String(body.keyword || "").trim();
  if (!keyword) return json({ error: "Keyword required" }, 400);
  const now = new Date().toISOString();
  const existing = await env.DB.prepare(`SELECT id FROM studio_keywords WHERE keyword = ?`).bind(keyword).first();
  if (existing) {
    await env.DB.prepare(
      `UPDATE studio_keywords SET intent = ?, cluster = ?, status = ?, notes = ?, updated_at = ? WHERE id = ?`,
    )
      .bind(body.intent || null, body.cluster || null, body.status || "active", body.notes || null, now, existing.id)
      .run();
    return json({ keyword: await env.DB.prepare(`SELECT * FROM studio_keywords WHERE id = ?`).bind(existing.id).first() });
  }
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO studio_keywords (id, keyword, intent, cluster, status, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, keyword, body.intent || null, body.cluster || null, body.status || "active", body.notes || null, now)
    .run();
  return json({ keyword: await env.DB.prepare(`SELECT * FROM studio_keywords WHERE id = ?`).bind(id).first() }, 201);
}

async function deleteKeyword(request, env) {
  const id = decodeURIComponent(new URL(request.url).pathname.slice("/api/studio/keywords/".length));
  await env.DB.prepare(`DELETE FROM studio_keywords WHERE id = ?`).bind(id).run();
  return json({ ok: true });
}

async function listActivity(request, env) {
  await ensureTables(env);
  const rows = env.DB
    ? (await env.DB.prepare(`SELECT * FROM studio_activity ORDER BY created_at DESC LIMIT 50`).all()).results || []
    : [];
  return json({ activity: rows });
}

async function studioSettings(request, env, session) {
  const { repo, branch } = repoInfo(env);
  return json({
    repo,
    branch,
    githubOAuth: Boolean(env.GITHUB_CLIENT_ID) && githubAllowlist(env).length > 0,
    passwordFallback: Boolean(env.ADMIN_PASSWORD_HASH),
    publishReady: Boolean(session.gh || env.GITHUB_TOKEN),
    user: { login: session.login, name: session.name, avatar: session.avatar, method: session.method },
  });
}

async function bootstrapIfEmpty(request, env, session) {
  const result = await bootstrapIfEmptyInner(env, session, true);
  return json(result);
}

async function bootstrapIfEmptyInner(env, session, force) {
  await ensureTables(env);
  await seedKeywords(env);
  const count = env.DB
    ? (await env.DB.prepare(`SELECT COUNT(*) as c FROM studio_entries`).first())?.c || 0
    : 0;
  if (count > 0 && !force) return { bootstrapped: false, count };
  if (count > 0) return { bootstrapped: false, count };
  const samples = sampleEntries();
  const now = new Date().toISOString();
  for (const sample of samples) {
    await env.DB.prepare(
      `INSERT OR IGNORE INTO studio_entries (id, collection, slug, title, status, data_json, body, github_path, published_at, created_at, updated_at, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        sample.id,
        sample.collection,
        sample.slug,
        sample.title,
        "published",
        JSON.stringify(sample.data),
        sample.body,
        sample.path,
        sample.data.publishDate || now,
        now,
        now,
        session?.login || "system",
        session?.login || "system",
      )
      .run();
  }
  return { bootstrapped: true, count: samples.length };
}

function sampleEntries() {
  return [
    {
      id: "seed-news-blocked-account",
      collection: "news",
      slug: "germany-blocked-account-2026-what-changed",
      title: "Germany blocked account 2026: what Pakistani students should verify now",
      path: "src/content/news/germany-blocked-account-2026-what-changed.mdx",
      data: {
        title: "Germany blocked account 2026: what Pakistani students should verify now",
        description:
          "The blocked-account amount used for Germany student visas changes. Here is what Pakistani applicants should confirm before they book VFS or move funds.",
        publishDate: "2026-08-20",
        updatedDate: "2026-08-20",
        author: "SK Immigration Services",
        category: "study-visa",
        tags: ["germany", "ielts", "process"],
        keywords: ["Germany blocked account 2026", "Sperrkonto Pakistan", "Germany student visa funds"],
        heroImage: "/assets/img/og-share.jpg",
        heroAlt: "SK Immigration Services — Germany study guidance",
        draft: false,
        featured: true,
        dateline: "Rawalpindi, Pakistan",
        relatedBlog: "study-europe-without-ielts-from-pakistan",
        relatedStory: "europe-without-ielts-story",
        sources: [{ name: "German Missions in Pakistan", url: "https://pakistan.diplo.de/" }],
      },
      body: "The blocked account (Sperrkonto) is still the document German missions ask most Pakistani students to prove living funds. The **euro amount is not a SK Immigration fee** — it is a government/bank requirement that can change.",
    },
    {
      id: "seed-blog-ielts",
      collection: "blog",
      slug: "study-europe-without-ielts-from-pakistan",
      title: "Study in Europe without IELTS from Pakistan — realistic routes in 2026",
      path: "src/content/blog/study-europe-without-ielts-from-pakistan.mdx",
      data: {
        title: "Study in Europe without IELTS from Pakistan — realistic routes in 2026",
        description:
          "MOI letters, German-taught degrees, and flexible EU admissions. A practical map for Pakistani students, with FAQs, official next steps, and no fake visa promises.",
        publishDate: "2026-08-20",
        updatedDate: "2026-08-20",
        author: "SK Immigration Services",
        category: "how-to",
        tags: ["ielts", "germany", "hungary", "italy", "process"],
        keywords: [
          "study in Europe without IELTS from Pakistan",
          "MOI letter student visa",
          "Germany without IELTS",
        ],
        draft: false,
        featured: true,
        relatedStories: ["europe-without-ielts-story"],
        relatedNews: ["germany-blocked-account-2026-what-changed"],
        relatedService: "/guides/study-abroad-without-ielts-pakistan/",
        country: "Europe",
        faqs: [
          {
            question: "Can I study in Europe without IELTS from Pakistan?",
            answer:
              "Sometimes. German-taught programs, some public universities in Italy, Hungary, Poland, Romania, and several private pathway schools accept MOI letters or their own tests.",
          },
          {
            question: "Is an MOI letter enough for a Schengen student visa?",
            answer:
              "Only if the university and the consulate both accept it. Many files still fail because the MOI is weak, not on letterhead, or the program is actually English-taught.",
          },
          {
            question: "Which countries are most realistic with 50–60% marks and no IELTS?",
            answer:
              "Hungary, Poland, Romania, Slovakia, and some Italian public programs are often more flexible than the UK or Canada. Marks, funds, and a clean study plan still matter more than slogans.",
          },
        ],
      },
      body: "If you are searching **“study in Europe without IELTS from Pakistan”**, you usually want one of three things: a German-taught degree, an MOI (medium of instruction) waiver, or a country that runs its own English test.",
    },
    {
      id: "seed-story-ielts",
      collection: "web-stories",
      slug: "europe-without-ielts-story",
      title: "Europe without IELTS — 15-second recap",
      path: "src/content/web-stories/europe-without-ielts-story.mdx",
      data: {
        title: "Europe without IELTS — 15-second recap",
        description:
          "A tap-through story for Pakistani students. Ends on the full blog so Google, Discover, and WhatsApp traffic can rank and convert.",
        publishDate: "2026-08-20",
        author: "SK Immigration Services",
        category: "study-visa",
        tags: ["ielts", "germany", "hungary"],
        keywords: ["study Europe without IELTS", "MOI letter Pakistan"],
        posterPortrait: "/assets/img/og-share.jpg",
        draft: false,
        relatedBlog: "study-europe-without-ielts-from-pakistan",
        relatedNews: "germany-blocked-account-2026-what-changed",
        durationSeconds: 11,
        slides: [
          {
            heading: "No IELTS. Not ‘no English’.",
            text: "Some EU routes accept MOI letters or German-taught degrees. UK/Canada still usually want a SELT.",
          },
          {
            heading: "Germany’s real lever",
            text: "Public universities taught in German often skip IELTS. You still need funds, insurance, and a blocked account.",
          },
          {
            heading: "Flexible marks",
            text: "Hungary, Poland, and Romania are often more realistic at 50–65% if documents and funds are clean.",
          },
          {
            heading: "MOI must be strong",
            text: "Letterhead, years of English-medium study, registrar stamp. Weak MOI files still get refused.",
          },
        ],
      },
      body: "",
    },
  ];
}

const KEYWORD_SEED = [
  ["study visa from Pakistan", "commercial", "lander"],
  ["Germany student visa Pakistan", "informational", "blog"],
  ["Germany blocked account 2026", "informational", "news"],
  ["study in Europe without IELTS from Pakistan", "informational", "story"],
  ["Saudi work visa processing PKR 15000", "transactional", "lander"],
];

async function seedKeywords(env) {
  if (!env.DB) return;
  const count = (await env.DB.prepare(`SELECT COUNT(*) as c FROM studio_keywords`).first())?.c || 0;
  if (count > 0) return;
  const now = new Date().toISOString();
  for (const [keyword, intent, cluster] of KEYWORD_SEED) {
    await env.DB.prepare(
      `INSERT OR IGNORE INTO studio_keywords (id, keyword, intent, cluster, status, notes, updated_at) VALUES (?, ?, ?, ?, 'active', NULL, ?)`,
    )
      .bind(crypto.randomUUID(), keyword, intent, cluster, now)
      .run();
  }
}

async function ensureTables(env) {
  if (!env.DB) return;
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS studio_entries (
      id TEXT PRIMARY KEY,
      collection TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      data_json TEXT NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      github_path TEXT,
      github_sha TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by TEXT,
      updated_by TEXT,
      UNIQUE (collection, slug)
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS studio_media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      public_path TEXT NOT NULL,
      github_sha TEXT,
      alt TEXT,
      created_at TEXT NOT NULL,
      created_by TEXT
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS studio_keywords (
      id TEXT PRIMARY KEY,
      keyword TEXT NOT NULL UNIQUE,
      intent TEXT,
      cluster TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      notes TEXT,
      updated_at TEXT NOT NULL
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS studio_activity (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      collection TEXT,
      entry_id TEXT,
      actor TEXT,
      detail TEXT,
      created_at TEXT NOT NULL
    )`),
  ]);
}

async function getEntryRow(env, id) {
  if (!env.DB) return null;
  return env.DB.prepare(`SELECT * FROM studio_entries WHERE id = ?`).bind(id).first();
}

function hydrateEntry(row) {
  if (!row) return null;
  return {
    ...row,
    data: JSON.parse(row.data_json || "{}"),
  };
}

async function logActivity(env, { action, collection = null, entry_id = null, actor = null, detail = null }) {
  if (!env.DB) return;
  await env.DB.prepare(
    `INSERT INTO studio_activity (id, action, collection, entry_id, actor, detail, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(crypto.randomUUID(), action, collection, entry_id, actor, detail, new Date().toISOString())
    .run();
}

async function readJson(request, max = 512 * 1024) {
  const len = Number(request.headers.get("content-length") || 0);
  if (len > max) {
    const err = new Error("Payload too large");
    err.status = 413;
    throw err;
  }
  try {
    return await request.json();
  } catch {
    const err = new Error("Invalid JSON");
    err.status = 400;
    throw err;
  }
}

function slugify(value) {
  return String(value || "untitled")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "untitled";
}

function extFromName(name, mime) {
  const fromName = (name.split(".").pop() || "").toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(fromName)) return fromName === "jpeg" ? "jpg" : fromName;
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "image/svg+xml") return "svg";
  return "jpg";
}

function dateOnly(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function sanitizeData(collection, data) {
  const out = { ...data };
  if (!out.author) out.author = "SK Immigration Services";
  out.publishDate = dateOnly(out.publishDate || out.pubDate);
  delete out.pubDate;
  if (out.updatedDate) out.updatedDate = dateOnly(out.updatedDate);
  if (!Array.isArray(out.tags)) out.tags = [];
  out.tags = out.tags.map(String).slice(0, 12);
  if (!Array.isArray(out.keywords)) out.keywords = [];
  if (collection === "news" && !out.category) out.category = "study-visa";
  if (collection === "blog" && !out.category) out.category = "how-to";
  if (collection === "web-stories" && !out.category) out.category = "study-visa";
  if (collection === "news") {
    if (!out.dateline) out.dateline = "Rawalpindi, Pakistan";
    if (!Array.isArray(out.sources)) out.sources = [];
  }
  if (collection === "blog" && !Array.isArray(out.faqs)) out.faqs = [];
  if (collection === "web-stories" && !Array.isArray(out.slides)) out.slides = [];
  return out;
}

function yamlScalar(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  const str = String(value);
  if (/[:#\n&*?{}[\],>|'"%@`]/.test(str) || str !== str.trim()) {
    return JSON.stringify(str);
  }
  return str;
}

function serializeMdx(collection, data, body) {
  const lines = ["---"];
  const dump = (key, value, indent = 0) => {
    const pad = "  ".repeat(indent);
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      if (value.every((v) => typeof v !== "object")) {
        lines.push(`${pad}${key}: [${value.map((v) => yamlScalar(v)).join(", ")}]`);
        return;
      }
      lines.push(`${pad}${key}:`);
      for (const item of value) {
        if (typeof item !== "object") {
          lines.push(`${pad}- ${yamlScalar(item)}`);
        } else {
          const keys = Object.keys(item);
          keys.forEach((k, i) => {
            const prefix = i === 0 ? `${pad}- ` : `${pad}  `;
            lines.push(`${prefix}${k}: ${yamlScalar(item[k])}`);
          });
        }
      }
      return;
    }
    if (typeof value === "object") {
      lines.push(`${pad}${key}:`);
      for (const [k, v] of Object.entries(value)) dump(k, v, indent + 1);
      return;
    }
    lines.push(`${pad}${key}: ${yamlScalar(value)}`);
  };
  const order = [
    "title",
    "description",
    "publishDate",
    "updatedDate",
    "author",
    "category",
    "tags",
    "heroImage",
    "heroAlt",
    "posterPortrait",
    "posterAlt",
    "draft",
    "featured",
    "canonical",
    "noindex",
    "readingTime",
    "dateline",
    "durationSeconds",
    "relatedBlog",
    "relatedStory",
    "relatedStories",
    "relatedNews",
    "relatedService",
    "country",
    "keywords",
    "sources",
    "faqs",
    "affiliates",
    "slides",
  ];
  for (const key of order) dump(key, data[key]);
  for (const key of Object.keys(data)) {
    if (!order.includes(key) && key !== "slug") dump(key, data[key]);
  }
  lines.push("---", "");
  lines.push(String(body || "").trim(), "");
  return lines.join("\n");
}

function b64(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

async function putGithubFile(env, token, path, content, message, sha, alreadyBase64 = false) {
  const { repo, branch } = repoInfo(env);
  const encoded = alreadyBase64 ? content : b64(new TextEncoder().encode(content));
  const api = `https://api.github.com/repos/${repo}/contents/${path}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "sk-immigration-studio",
    "Content-Type": "application/json",
  };
  let useSha = sha;
  if (!useSha) {
    const existing = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
    if (existing.ok) {
      const jsonBody = await existing.json();
      useSha = jsonBody.sha;
    }
  }
  const payload = { message, content: encoded, branch };
  if (useSha) payload.sha = useSha;
  const res = await fetch(api, { method: "PUT", headers, body: JSON.stringify(payload) });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || `GitHub write failed (${res.status})`);
    err.status = 502;
    throw err;
  }
  return { sha: body.content?.sha || useSha, path };
}
