import fs from 'fs';
import path from 'path';

const DIR = '/Users/4star/.gemini/antigravity/scratch/sk-immigration-website';
const TARGET_FOLDERS = ['study-visa', 'work-permit', 'visit-visa', 'visa-appointment', 'saudi-visa', 'ur', 'document-services'];

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      if (fullPath.endsWith('.html')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const SIDEBAR_HTML = `
      <!-- Sticky Executive Sidebar -->
      <aside class="guide-sidebar">
        <!-- Quick Consultation Card -->
        <div class="guide-sidebar-card">
          <h4>⚡ Free Case Assessment</h4>
          <p>Get your profile and visa timeline reviewed by our consultant.</p>
          <a class="btn btn-whatsapp" style="width:100%;margin-bottom:8px" href="https://wa.me/923045999859?text=Hi%20SK%20Immigration%2C%20I%20need%20a%20free%20visa%20assessment" target="_blank" rel="noopener">WhatsApp +92 304 5999859</a>
          <a class="btn btn-gold btn-sm" style="width:100%" href="/contact.html">Book Office Visit</a>
        </div>

        <!-- Sticky Sidebar Google AdSense Unit -->
        <div class="sk-ad-container my-0" aria-label="Sponsored Guidance">
          <span class="sk-ad-label">Advertisement</span>
          <div class="sk-ad-slot sk-ad-sidebar">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-5113459275916426"
                 data-ad-slot="auto"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </div>

        <!-- Related Popular Guides -->
        <div class="guide-sidebar-card">
          <h4>🌍 Popular Visa Guides</h4>
          <div class="guide-sidebar-links">
            <a href="/study-visa/germany-study-visa-pakistan/">🇩🇪 Germany Study <span>→</span></a>
            <a href="/study-visa/uk-study-visa-pakistan/">🇬🇧 UK Student Route <span>→</span></a>
            <a href="/study-visa/canada-study-visa-pakistan/">🇨🇦 Canada SDS <span>→</span></a>
            <a href="/saudi-visa/saudi-visa-processing-pakistan/">🇸🇦 Saudi Work 15k <span>→</span></a>
            <a href="/visit-visa/dubai-visit-visa-pakistan/">🇦🇪 Dubai Visit <span>→</span></a>
          </div>
        </div>
      </aside>
    </div>
`;

const MID_AD_HTML = `
          <!-- Mid-Article Google AdSense Container -->
          <div class="sk-ad-container" aria-label="Sponsored Education Resource" style="margin: 2rem 0;">
            <span class="sk-ad-label">Advertisement · Sponsored Resources</span>
            <div class="sk-ad-slot sk-ad-infeed">
              <ins class="adsbygoogle"
                   style="display:block"
                   data-ad-client="ca-pub-5113459275916426"
                   data-ad-slot="auto"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
          </div>
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already has dossier container
  if (content.includes('guide-dossier-container')) return;

  // Pattern 1: Page has `<main>` and then `<article class="glass card">`
  const mainRegex = /<main\s+id="main"[^>]*>([\s\S]*?)<article[^>]*class="[^"]*glass card[^"]*"[^>]*>/i;
  
  if (mainRegex.test(content)) {
    content = content.replace(mainRegex, (match, p1) => {
      return `<main id="main" class="guide-dossier-container">
    <div class="guide-dossier-grid">
      <article class="guide-main-article">
${p1}`;
    });

    // Replace the end tags
    // The previous structure was </article> \n </main>. 
    // Wait, the global ad script might have added something before </main>.
    // Let's replace </article> with the sidebar, provided it's the main article closing tag.
    // Actually, just find the LAST </article> before </main>.
    const endRegex = /<\/article>([\s\S]*?)<\/main>/i;
    content = content.replace(endRegex, (match, p1) => {
        return `</article>
${SIDEBAR_HTML}
${p1}</main>`;
    });
    
    // Inject Mid-Article ad
    if (!content.includes('sk-ad-infeed')) {
        let h2s = content.match(/<h2[^>]*>.*?<\/h2>/g);
        if (h2s && h2s.length >= 3) {
            content = content.replace(h2s[2], MID_AD_HTML + '\\n' + h2s[2]);
        }
    }

    fs.writeFileSync(filePath, content);
    console.log(`Upgraded: ${path.relative(DIR, filePath)}`);
  } else {
    // If it doesn't have the glass card, maybe it's just a raw main container.
    // We can do a simpler replacement if necessary.
    console.log(`Skipped (No matching structure): ${path.relative(DIR, filePath)}`);
  }
}

let count = 0;
for (const folder of TARGET_FOLDERS) {
  const folderPath = path.join(DIR, folder);
  if (fs.existsSync(folderPath)) {
    const files = getFiles(folderPath);
    for (const file of files) {
      const original = fs.readFileSync(file, 'utf-8');
      processFile(file);
      if (fs.readFileSync(file, 'utf-8') !== original) {
          count++;
      }
    }
  }
}

console.log(`Done! Upgraded ${count} pages to the 2-column layout.`);
