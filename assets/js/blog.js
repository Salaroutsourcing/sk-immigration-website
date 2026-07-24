/**
 * Blog listing + post view + admin CRUD (localStorage overlay on JSON seed)
 */
(function () {
  function dataUrl(file) {
    const inAdmin = location.pathname.includes('/admin');
    return (inAdmin ? '../' : '') + 'assets/data/' + file;
  }

  async function seedPosts() {
    const stored = SalarAPI.getBlogPosts();
    if (stored && stored.length) return stored;
    try {
      const res = await fetch(dataUrl('blog-posts.json'));
      const posts = await res.json();
      SalarAPI.saveBlogPosts(posts);
      return posts;
    } catch {
      return [];
    }
  }

  function bySlug(posts, slug) {
    return posts.find((p) => p.slug === slug);
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

  window.SalarBlog = {
    async mountList(selector) {
      const el = document.querySelector(selector);
      if (!el) return;
      const posts = await seedPosts();
      const q = new URLSearchParams(location.search).get('q') || '';
      const cat = new URLSearchParams(location.search).get('cat') || '';
      let list = posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
      if (q) list = list.filter((p) => (p.title + p.excerpt + (p.tags || []).join(' ')).toLowerCase().includes(q.toLowerCase()));
      if (cat) list = list.filter((p) => p.category === cat);

      el.innerHTML = list
        .map((p) => {
          const link = p.url || `blog-post.html?slug=${encodeURIComponent(p.slug)}`;
          return `
        <article class="glass card blog-card reveal">
          <div class="flex justify-between items-center">
            <span class="badge">${p.category}</span>
            <span class="meta">${p.date}</span>
          </div>
          <h3><a href="${link}">${p.title}</a></h3>
          <p class="text-muted" style="font-size:0.925rem">${p.excerpt}</p>
          <a class="text-gold" href="${link}">Read article →</a>
        </article>`;
        })
        .join('');
    },

    async mountPost(selector) {
      const el = document.querySelector(selector);
      if (!el) return;
      const slug = new URLSearchParams(location.search).get('slug');
      const posts = await seedPosts();
      const post = bySlug(posts, slug);
      if (!post) {
        el.innerHTML = `<div class="glass card"><h1>Post not found</h1><p class="text-muted">This article may have been removed.</p><a class="btn btn-gold mt-2" href="blog.html">Back to blog</a></div>`;
        return;
      }
      document.title = `${post.title} | SK Immigration Services`;
      setMeta('name', 'description', (post.excerpt || post.title).slice(0, 158));
      setLink('canonical', `${location.origin}/blog-post.html?slug=${encodeURIComponent(post.slug)}`);
      el.innerHTML = `
        <article class="glass card" style="padding:2rem">
          <p class="eyebrow">${post.category} · ${post.date}</p>
          <h1 class="display" style="font-size:clamp(1.75rem,3vw,2.5rem);margin-bottom:0.75rem">${post.title}</h1>
          <p class="text-muted mb-2">By ${post.author}</p>
          <div class="prose">${post.content}</div>
          <div class="ad-slot mt-3">Partner / Ad placement — universities & insurance partners</div>
          <div class="hero-ctas mt-3">
            <a class="btn btn-gold" href="contact.html">Discuss my case</a>
            <a class="btn btn-ghost" href="blog.html">All articles</a>
          </div>
        </article>`;
    },

    async getAll() {
      return seedPosts();
    },

    async savePost(post) {
      const posts = await seedPosts();
      const i = posts.findIndex((p) => p.id === post.id);
      if (i >= 0) posts[i] = post;
      else posts.unshift(post);
      SalarAPI.saveBlogPosts(posts);
      await SalarAPI.syncRemote.postToGas('saveBlogPost', { data: post });
      return posts;
    },

    async deletePost(id) {
      let posts = await seedPosts();
      posts = posts.filter((p) => p.id !== id);
      SalarAPI.saveBlogPosts(posts);
      await SalarAPI.syncRemote.postToGas('deleteBlogPost', { id });
      return posts;
    },
  };
})();
