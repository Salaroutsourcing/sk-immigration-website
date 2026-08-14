import fs from 'fs';
import path from 'path';

const DIR = '/Users/4star/.gemini/antigravity/scratch/sk-immigration-website';

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!['.git', 'node_modules', 'scratch', 'admin', '.github', 'scripts'].includes(file)) {
        results = results.concat(getFiles(fullPath));
      }
    } else {
      if (fullPath.endsWith('.html')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const adHTML = `
    <!-- ═══════════════════════════════════════════════════════════
         Google AdSense Monetization Slot: Non-Intrusive Bottom
         ═══════════════════════════════════════════════════════════ -->
    <div class="hl-wrap" style="padding-top: 2rem; padding-bottom: 3rem;">
      <div class="sk-ad-container" aria-label="Advertisement">
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
    </div>
`;

function injectAd(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if it already has an ad container
  if (content.includes('class="sk-ad-container"')) {
    return;
  }
  
  // Skip very small files or admin/redirects
  if (filePath.includes('404.html') || filePath.includes('portal.html')) {
      return;
  }

  // Inject right before </main> if it exists, otherwise before <div id="site-footer"></div>
  if (content.includes('</main>')) {
    content = content.replace('</main>', adHTML + '\n  </main>');
    fs.writeFileSync(filePath, content);
    console.log(`Injected ad into ${path.relative(DIR, filePath)} (before </main>)`);
  } else if (content.includes('<div id="site-footer"></div>')) {
    content = content.replace('<div id="site-footer"></div>', adHTML + '\n  <div id="site-footer"></div>');
    fs.writeFileSync(filePath, content);
    console.log(`Injected ad into ${path.relative(DIR, filePath)} (before footer)`);
  } else {
    console.log(`Skipped ${path.relative(DIR, filePath)} - no injection point found.`);
  }
}

const allFiles = getFiles(DIR);
let count = 0;
for (const f of allFiles) {
  const original = fs.readFileSync(f, 'utf-8');
  injectAd(f);
  if (fs.readFileSync(f, 'utf-8') !== original) {
      count++;
  }
}

console.log(`Done. Injected ads into ${count} files.`);
