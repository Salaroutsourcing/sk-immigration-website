/**
 * On-site AI helper — answers from ai-kb.json (no external API)
 */
(function () {
  const BASE = (() => {
    if (location.pathname.includes('/blog/') && location.pathname.split('/').filter(Boolean).length >= 2) return '../../';
    if (location.pathname.includes('/answers/') || location.pathname.includes('/admin')) return '../';
    return '';
  })();

  let KB = null;
  let open = false;

  async function loadKb() {
    if (KB) return KB;
    try {
      const res = await fetch(BASE + 'assets/data/ai-kb.json');
      KB = await res.json();
    } catch {
      KB = { entries: [] };
    }
    return KB;
  }

  function score(entry, q) {
    const words = q.toLowerCase().split(/[^a-z0-9+]+/).filter((w) => w.length > 2);
    let s = 0;
    const hay = (entry.questions.join(' ') + ' ' + entry.answer).toLowerCase();
    words.forEach((w) => {
      if (hay.includes(w)) s += 2;
    });
    entry.questions.forEach((qq) => {
      if (q.toLowerCase().includes(String(qq).toLowerCase()) || String(qq).toLowerCase().includes(q.toLowerCase())) s += 5;
    });
    return s;
  }

  function answer(q) {
    if (!q.trim()) return null;
    const ranked = KB.entries
      .map((e) => ({ e, s: score(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    if (!ranked.length) {
      return {
        answer:
          "I don't have a perfect match yet. Try the eligibility quiz, document checklist, or WhatsApp our team — free first consult. We never guarantee visas.",
        url: 'contact.html',
      };
    }
    return ranked[0].e;
  }

  function mount() {
    if (document.getElementById('skAiRoot')) return;
    const wrap = document.createElement('div');
    wrap.id = 'skAiRoot';
    wrap.innerHTML = `
      <button type="button" class="ai-fab" id="skAiFab" aria-expanded="false" aria-controls="skAiPanel" title="Ask SK Immigration">
        <span>Ask SK</span>
      </button>
      <div class="ai-panel glass-strong" id="skAiPanel" hidden>
        <div class="ai-panel-head">
          <div>
            <strong>SK Instant Answers</strong>
            <p class="text-muted" style="margin:0;font-size:0.8rem">From our guides · Not a visa guarantee</p>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" id="skAiClose" aria-label="Close">✕</button>
        </div>
        <div class="ai-chips">
          <button type="button" data-q="study europe without IELTS">No IELTS?</button>
          <button type="button" data-q="Germany Ausbildung">Ausbildung</button>
          <button type="button" data-q="low marks study abroad">Low marks</button>
          <button type="button" data-q="document checklist">Checklist</button>
          <button type="button" data-q="contact WhatsApp">Contact</button>
        </div>
        <div class="ai-messages" id="skAiMsgs" role="log" aria-live="polite"></div>
        <form class="ai-form" id="skAiForm">
          <input class="form-control" id="skAiInput" placeholder="Ask about visas, costs, documents…" autocomplete="off" />
          <button class="btn btn-gold btn-sm" type="submit">Ask</button>
        </form>
      </div>`;
    document.body.appendChild(wrap);

    const panel = document.getElementById('skAiPanel');
    const fab = document.getElementById('skAiFab');
    const msgs = document.getElementById('skAiMsgs');

    function addMsg(role, html) {
      const div = document.createElement('div');
      div.className = 'ai-msg ai-' + role;
      div.innerHTML = html;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    async function reply(q) {
      await loadKb();
      addMsg('user', `<p>${q.replace(/</g, '&lt;')}</p>`);
      const hit = answer(q);
      const link = hit.url ? `<p><a href="${BASE}${hit.url}">Read more →</a> · <a href="${BASE}contact.html">Free consult</a></p>` : '';
      addMsg('bot', `<p>${hit.answer}</p>${link}`);
    }

    fab.addEventListener('click', async () => {
      open = !open;
      panel.hidden = !open;
      fab.setAttribute('aria-expanded', open);
      if (open) {
        await loadKb();
        if (!msgs.children.length) {
          addMsg(
            'bot',
            '<p>Hi — ask about low marks, IELTS, Ausbildung, costs, or pick a country. For personal files, WhatsApp is fastest.</p>'
          );
        }
      }
    });
    document.getElementById('skAiClose').addEventListener('click', () => {
      open = false;
      panel.hidden = true;
      fab.setAttribute('aria-expanded', 'false');
    });
    document.getElementById('skAiForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('skAiInput');
      const q = input.value.trim();
      if (!q) return;
      input.value = '';
      reply(q);
    });
    wrap.querySelectorAll('.ai-chips button').forEach((btn) => {
      btn.addEventListener('click', () => reply(btn.dataset.q));
    });
  }

  document.addEventListener('DOMContentLoaded', mount);
})();
