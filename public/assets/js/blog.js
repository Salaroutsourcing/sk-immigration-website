/**
 * Blog listing + post view — prefers D1 public API, falls back to JSON seed.
 */
(function () {
  function dataUrl(file) {
    const inAdmin = location.pathname.includes('/admin');
    return (inAdmin ? '../' : '') + 'assets/data/' + file;
  }

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeHref(href) {
    const h = String(href || '').trim();
    if (!h || /^(javascript|data|vbscript):/i.test(h)) return '#';
    return esc(h);
  }

  function sanitizeHtml(html) {
    return String(html ?? '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<\/?(iframe|object|embed|link|meta|base|form)[^>]*>/gi, '')
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)\s*=\s*(["'])\s*(javascript|data|vbscript):/gi, '$1=$2#');
  }

  async function loadPosts() {
    if (window.SalarAPI?.listBlogPosts) {
      const fromApi = await SalarAPI.listBlogPosts();
      if (fromApi && fromApi.length) return fromApi;
    }
    try {
      const res = await fetch(dataUrl('blog-posts.json'));
      return await res.json();
    } catch {
      return [];
    }
  }

  async function loadPost(slug) {
    if (window.SalarAPI?.getBlogPost) {
      const fromApi = await SalarAPI.getBlogPost(slug);
      if (fromApi) return fromApi;
    }
    const posts = await loadPosts();
    return posts.find((p) => p.slug === slug) || null;
  }

  function setMeta(attr, key, value) {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function setLink(rel, hrefValue) {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', hrefValue);
  }

  function estimateReadTime(text) {
    const words = String(text || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  }

  window.SalarBlog = {
    async mountList(selector) {
      const el = document.querySelector(selector);
      if (!el) return;
      const posts = await loadPosts();
      const q = new URLSearchParams(location.search).get('q') || '';
      const cat = new URLSearchParams(location.search).get('cat') || '';
      let list = posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
      
      if (q) {
        list = list.filter((p) =>
          (p.title + p.excerpt + (p.tags || []).join(' ')).toLowerCase().includes(q.toLowerCase())
        );
      }
      if (cat) list = list.filter((p) => p.category === cat || (p.tags || []).includes(cat));

      if (!list.length) {
        el.innerHTML = `
          <div class="glass card text-center py-4" style="grid-column:1/-1">
            <h3>No articles found</h3>
            <p class="text-muted">Try searching with a different keyword like "Germany", "Ausbildung", or "IELTS".</p>
            <a class="btn btn-gold btn-sm mt-2" href="blog.html">View all guides</a>
          </div>`;
        return;
      }

      let html = '';
      
      // If viewing all and not searching, highlight first post as Featured Magazine Hero
      let startIndex = 0;
      if (!q && !cat && list[0]) {
        const feat = list[0];
        const featLink = safeHref(feat.url || `blog-post.html?slug=${encodeURIComponent(feat.slug)}`);
        html += `
          <div class="glass card blog-card-featured reveal" style="grid-column:1/-1;margin-bottom:1.5rem;padding:clamp(1.5rem,3vw,2.2rem)">
            <div class="flex justify-between items-center mb-2">
              <span class="badge" style="background:linear-gradient(135deg,#c9a84c,#a07830);color:#fff">★ Featured Guide</span>
              <span class="meta">${esc(feat.date)} · ${estimateReadTime(feat.content || feat.excerpt)}</span>
            </div>
            <h2 style="font-size:clamp(1.5rem,2.5vw,2rem);margin-bottom:0.75rem"><a href="${featLink}">${esc(feat.title)}</a></h2>
            <p class="text-muted" style="font-size:1.05rem;line-height:1.65;margin-bottom:1.25rem">${esc(feat.excerpt)}</p>
            <div class="flex justify-between items-center">
              <a class="btn btn-gold btn-sm" href="${featLink}">Read Complete Guide →</a>
              <span class="text-dim" style="font-size:0.85rem">By ${esc(feat.author || 'SK Immigration')}</span>
            </div>
          </div>
        `;
        startIndex = 1;
      }

      for (let i = startIndex; i < list.length; i++) {
        const p = list[i];
        const link = safeHref(p.url || `blog-post.html?slug=${encodeURIComponent(p.slug)}`);
        const readTime = estimateReadTime(p.content || p.excerpt);

        html += `
        <article class="glass card blog-card reveal">
          <div class="flex justify-between items-center mb-2">
            <span class="badge">${esc(p.category)}</span>
            <span class="meta">${esc(p.date)} · ${readTime}</span>
          </div>
          <h3 style="font-size:1.15rem;margin-bottom:0.6rem;line-height:1.4"><a href="${link}">${esc(p.title)}</a></h3>
          <p class="text-muted" style="font-size:0.925rem;line-height:1.6;margin-bottom:1rem">${esc(p.excerpt)}</p>
          <div class="flex justify-between items-center mt-auto" style="border-top:1px solid var(--glass-border);padding-top:0.75rem">
            <a class="text-gold" style="font-weight:700;font-size:0.9rem" href="${link}">Read article →</a>
            <span style="font-size:0.8rem;color:var(--text-dim)">Verified ✓</span>
          </div>
        </article>`;

        // Insert native Google AdSense container after every 4th card for high viewability & earnings
        if (i === startIndex + 3 && list.length > 5) {
          html += `
          <div class="sk-ad-container" style="grid-column:1/-1" aria-label="Sponsored Immigration Resource">
            <span class="sk-ad-label">Advertisement · Sponsored Content</span>
            <div class="sk-ad-slot sk-ad-infeed">
              <ins class="adsbygoogle"
                   style="display:block"
                   data-ad-client="ca-pub-5113459275916426"
                   data-ad-slot="auto"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
          </div>`;
        }
      }

      el.innerHTML = html;

      // Prefer Adsterra on blog surfaces (caps + soft units)
      if (typeof window.__SK_ADSTERRA_REFRESH__ === 'function') {
        window.__SK_ADSTERRA_REFRESH__();
      }
    },

    async mountPost(selector) {
      const el = document.querySelector(selector);
      if (!el) return;
      const slug = new URLSearchParams(location.search).get('slug');
      const post = await loadPost(slug);
      if (!post) {
        el.innerHTML = `<div class="glass card"><h1>Post not found</h1><p class="text-muted">This article may have been removed.</p><a class="btn btn-gold mt-2" href="blog.html">Back to blog</a></div>`;
        return;
      }
      document.title = `${post.title} | SK Immigration Services`;
      setMeta('name', 'description', (post.excerpt || post.title).slice(0, 158));
      setLink('canonical', `${location.origin}/blog-post.html?slug=${encodeURIComponent(post.slug)}`);
      
      const readTime = estimateReadTime(post.content || post.excerpt);

      el.innerHTML = `
        <article class="glass card" style="padding:clamp(1.5rem,4vw,2.5rem)">
          <div class="flex justify-between items-center mb-2">
            <p class="eyebrow" style="margin:0">${esc(post.category)} · ${esc(post.date)}</p>
            <span class="meta">${readTime} · Verified Editorial</span>
          </div>
          <h1 class="display" style="font-size:clamp(1.8rem,3.4vw,2.6rem);margin-bottom:0.75rem">${esc(post.title)}</h1>
          <p class="text-muted mb-2">By <strong>${esc(post.author || 'SK Immigration Services')}</strong> · Official CUIN 0304985</p>
          
          <!-- Top Article Ad Slot -->
          <div class="sk-ad-container my-3" aria-label="Advertisement Banner">
            <span class="sk-ad-label">Advertisement</span>
            <div class="sk-ad-slot sk-ad-leaderboard">
              <ins class="adsbygoogle"
                   style="display:block"
                   data-ad-client="ca-pub-5113459275916426"
                   data-ad-slot="auto"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
          </div>

          <div class="prose" style="font-size:1.05rem;line-height:1.75">${sanitizeHtml(post.content)}</div>
          
          <!-- Pre-Footer Article Ad Slot -->
          <div class="sk-ad-container mt-4" aria-label="Sponsored Partner Guide">
            <span class="sk-ad-label">Advertisement · Related Opportunities</span>
            <div class="sk-ad-slot sk-ad-infeed">
              <ins class="adsbygoogle"
                   style="display:block"
                   data-ad-client="ca-pub-5113459275916426"
                   data-ad-slot="auto"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
          </div>

          <div class="hero-ctas mt-4" style="border-top:1px solid var(--glass-border);padding-top:1.5rem">
            <a class="btn btn-gold" href="contact.html">Book Free Consultation</a>
            <a class="btn btn-whatsapp" href="https://wa.me/923045999859?text=Hi%20SK%20Immigration%2C%20I%20read%20your%20article%20on%20${encodeURIComponent(post.title)}" target="_blank" rel="noopener">WhatsApp Us</a>
            <a class="btn btn-ghost" href="blog.html">Browse All Guides</a>
          </div>
        </article>`;

      if (typeof window.__SK_ADSTERRA_REFRESH__ === 'function') {
        window.__SK_ADSTERRA_REFRESH__();
      }
    },

    async getAll() {
      return loadPosts();
    },
  };
})();

