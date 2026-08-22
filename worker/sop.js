/**
 * Daily publishing SOP helpers for Studio (Asia/Karachi desk).
 * Calendar: src/data/daily-sop.json
 */
import calendar from "../src/data/daily-sop.json" with { type: "json" };

const BANNED =
  /100%\s*visa|visa guaranteed|guaranteed visa|we guarantee your visa|guaranteed approval|confirmed visa|visa confirmed/i;

export const SOP_TIMEZONE = calendar.timezone || "Asia/Karachi";
export const SOP_TARGETS = calendar.targets || { news: 5, "web-stories": 5, blog: 1 };

export function todayPkt(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SOP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function weekdayPkt(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: SOP_TIMEZONE,
    weekday: "long",
  })
    .format(date)
    .toLowerCase();
}

export function planForDate(date = new Date()) {
  const weekday = weekdayPkt(date);
  const day = calendar.week[weekday];
  if (!day) {
    return { weekday, theme: "", blog: null, news: [], stories: [] };
  }
  return { weekday, ...day };
}

export function publishIssues(collection, data = {}, body = "", slug = "") {
  const issues = [];
  const title = String(data.title || "").trim();
  const description = String(data.description || "").trim();
  const text = `${title}\n${description}\n${body || ""}`;

  if (title.length < 12) issues.push("title too short");
  if (description.length < 40) issues.push("description too short");
  if (!String(slug || data.slug || "").trim()) issues.push("slug required");
  if (BANNED.test(text)) issues.push("remove visa-guarantee language");

  if (collection === "news") {
    const sources = Array.isArray(data.sources) ? data.sources : [];
    const official = sources.some((s) => /^https:\/\//i.test(String(s?.url || "")) && String(s?.name || "").trim());
    if (!official) issues.push("news needs an official source name + https URL");
    if (String(body || "").trim().length < 280) issues.push("news body is too thin");
  }

  if (collection === "blog") {
    const faqs = (data.faqs || []).filter((f) => f?.question && f?.answer);
    if (faqs.length < 3) issues.push("blog needs 3 FAQs");
    if (String(body || "").trim().length < 600) issues.push("blog body is too thin");
  }

  if (collection === "web-stories") {
    if (!String(data.relatedBlog || "").trim()) issues.push("story needs relatedBlog");
    if (!String(data.posterPortrait || "").trim()) issues.push("poster required");
    const slides = Array.isArray(data.slides) ? data.slides : [];
    if (slides.length < 4 || slides.length > 12) issues.push("need 4–12 slides");
    const last = slides[slides.length - 1] || {};
    const href = String(last.ctaHref || "");
    if (!href.startsWith("/blog/") && !href.includes("/blog/")) {
      issues.push("last slide must open the related blog");
    }
  }

  return issues;
}
