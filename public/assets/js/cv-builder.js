/**
 * Europass-style CV builder — preview, print, send as lead
 */
(function () {
  const state = {
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    objective: '',
    education: [{ school: '', degree: '', year: '' }],
    experience: [{ company: '', role: '', years: '', details: '' }],
    skills: '',
    languages: '',
    interests: '',
    certifications: '',
    references: '',
    target: '',
  };

  function field(name, label, value, type = 'text') {
    return `<div class="form-group"><label>${label}</label><input class="form-control" data-k="${name}" type="${type}" value="${value || ''}"></div>`;
  }

  window.SalarCV = {
    mount(rootSelector) {
      const root = document.querySelector(rootSelector);
      if (!root) return;
      let step = 0;

      function bindInputs(scope) {
        scope.querySelectorAll('[data-k]').forEach((inp) => {
          inp.addEventListener('input', () => {
            state[inp.dataset.k] = inp.value;
          });
        });
      }

      function render() {
        const steps = ['Personal', 'Education', 'Experience', 'Skills', 'Extras', 'Preview'];
        const nav = steps.map((s, i) => `<span class="badge ${i === step ? '' : 'badge-muted'}">${i + 1}. ${s}</span>`).join(' ');

        let body = '';
        if (step === 0) {
          body = `
            <div class="form-row">${field('fullName', 'Full name *', state.fullName)}${field('dob', 'Date of birth', state.dob, 'date')}</div>
            <div class="form-row">${field('email', 'Email *', state.email, 'email')}${field('phone', 'Phone *', state.phone)}</div>
            ${field('address', 'Address', state.address)}
            <div class="form-group"><label>Objective / Personal statement</label><textarea class="form-control" data-k="objective">${state.objective}</textarea></div>`;
        } else if (step === 1) {
          body = state.education
            .map(
              (e, i) => `
            <div class="glass card mb-2" style="padding:1rem">
              <div class="form-row">
                <div class="form-group"><label>School / University</label><input class="form-control" data-edu="${i}" data-f="school" value="${e.school}"></div>
                <div class="form-group"><label>Degree</label><input class="form-control" data-edu="${i}" data-f="degree" value="${e.degree}"></div>
              </div>
              <div class="form-group"><label>Year</label><input class="form-control" data-edu="${i}" data-f="year" value="${e.year}"></div>
            </div>`
            )
            .join('');
          body += `<button type="button" class="btn btn-ghost btn-sm" id="addEdu">+ Add education</button>`;
        } else if (step === 2) {
          body = state.experience
            .map(
              (e, i) => `
            <div class="glass card mb-2" style="padding:1rem">
              <div class="form-row">
                <div class="form-group"><label>Company</label><input class="form-control" data-exp="${i}" data-f="company" value="${e.company}"></div>
                <div class="form-group"><label>Role</label><input class="form-control" data-exp="${i}" data-f="role" value="${e.role}"></div>
              </div>
              <div class="form-group"><label>Years</label><input class="form-control" data-exp="${i}" data-f="years" value="${e.years}"></div>
              <div class="form-group"><label>Details</label><textarea class="form-control" data-exp="${i}" data-f="details">${e.details}</textarea></div>
            </div>`
            )
            .join('');
          body += `<button type="button" class="btn btn-ghost btn-sm" id="addExp">+ Add experience</button>`;
        } else if (step === 3) {
          body = `
            <div class="form-group"><label>Skills (comma separated)</label><input class="form-control" data-k="skills" value="${state.skills}"></div>
            <div class="form-group"><label>Languages</label><input class="form-control" data-k="languages" value="${state.languages}"></div>
            <div class="form-group"><label>Interests</label><input class="form-control" data-k="interests" value="${state.interests}"></div>`;
        } else if (step === 4) {
          body = `
            <div class="form-group"><label>Certifications</label><textarea class="form-control" data-k="certifications">${state.certifications}</textarea></div>
            <div class="form-group"><label>References</label><textarea class="form-control" data-k="references">${state.references}</textarea></div>
            <div class="form-group"><label>Target role / study goal</label><input class="form-control" data-k="target" value="${state.target}"></div>`;
        } else {
          body = `
            <div class="glass-strong" id="cvPreview" style="padding:1.5rem;border-radius:1rem;border:1px solid var(--glass-border)">
              <h2 style="font-family:var(--font-display)">${state.fullName || 'Your Name'}</h2>
              <p class="text-muted">${[state.email, state.phone, state.address].filter(Boolean).join(' · ')}</p>
              ${state.objective ? `<p class="mt-2">${state.objective}</p>` : ''}
              <h3 class="mt-3 text-gold">Education</h3>
              ${state.education.map((e) => `<p><strong>${e.degree}</strong> — ${e.school} <span class="text-muted">(${e.year})</span></p>`).join('')}
              <h3 class="mt-3 text-gold">Experience</h3>
              ${state.experience.map((e) => `<p><strong>${e.role}</strong> — ${e.company} <span class="text-muted">(${e.years})</span><br>${e.details || ''}</p>`).join('')}
              <h3 class="mt-3 text-gold">Skills</h3><p>${state.skills}</p>
              <h3 class="mt-3 text-gold">Languages</h3><p>${state.languages}</p>
              ${state.certifications ? `<h3 class="mt-3 text-gold">Certifications</h3><p>${state.certifications}</p>` : ''}
              ${state.target ? `<h3 class="mt-3 text-gold">Target</h3><p>${state.target}</p>` : ''}
            </div>
            <div class="hero-ctas mt-2">
              <button type="button" class="btn btn-navy" id="cvPrint">Download / Print</button>
              <button type="button" class="btn btn-gold" id="cvSend">Send to SK Immigration</button>
            </div>
            <div class="form-msg" id="cvMsg"></div>`;
        }

        root.innerHTML = `
          <div class="glass card">
            <p class="eyebrow">Free CV Builder</p>
            <div class="flex flex-wrap gap-2 mb-2">${nav}</div>
            <p class="text-muted" style="font-size:0.9rem;margin-bottom:1rem">Data stays in your browser unless you choose to send it. Keep information accurate — strong visa/job files rely on truthful documents.</p>
            <div id="cvBody">${body}</div>
            <div class="flex justify-between mt-3 gap-2 flex-wrap">
              <button type="button" class="btn btn-ghost" id="cvBack" ${step === 0 ? 'disabled' : ''}>← Back</button>
              ${step < 5 ? `<button type="button" class="btn btn-gold" id="cvNext">Next →</button>` : `<button type="button" class="btn btn-ghost" id="cvEdit">← Edit</button>`}
            </div>
          </div>`;

        bindInputs(root);
        root.querySelectorAll('[data-edu]').forEach((inp) => {
          inp.addEventListener('input', () => {
            state.education[+inp.dataset.edu][inp.dataset.f] = inp.value;
          });
        });
        root.querySelectorAll('[data-exp]').forEach((inp) => {
          inp.addEventListener('input', () => {
            state.experience[+inp.dataset.exp][inp.dataset.f] = inp.value;
          });
        });
        document.getElementById('addEdu')?.addEventListener('click', () => {
          state.education.push({ school: '', degree: '', year: '' });
          render();
        });
        document.getElementById('addExp')?.addEventListener('click', () => {
          state.experience.push({ company: '', role: '', years: '', details: '' });
          render();
        });
        document.getElementById('cvBack')?.addEventListener('click', () => {
          step--;
          render();
        });
        document.getElementById('cvNext')?.addEventListener('click', () => {
          if (step === 0 && (!state.fullName || !state.email || !state.phone)) {
            alert('Please fill name, email and phone.');
            return;
          }
          step++;
          render();
        });
        document.getElementById('cvEdit')?.addEventListener('click', () => {
          step = 0;
          render();
        });
        document.getElementById('cvPrint')?.addEventListener('click', () => {
          const html = document.getElementById('cvPreview')?.innerHTML || '';
          const w = window.open('', '_blank');
          w.document.write(`<html><head><title>CV - ${state.fullName}</title><style>body{font-family:system-ui;padding:2rem;max-width:800px;margin:auto;line-height:1.5} h2,h3{margin:1rem 0 0.35rem}</style></head><body>${html}<script>print()<\\/script></body></html>`);
          w.document.close();
        });
        document.getElementById('cvSend')?.addEventListener('click', async () => {
          const msg = document.getElementById('cvMsg');
          try {
            await SalarAPI.saveCVLead({ ...state });
            msg.className = 'form-msg show ok';
            msg.textContent = 'CV sent! Our team will review and contact you for next steps.';
          } catch {
            msg.className = 'form-msg show err';
            msg.textContent = 'Could not send. Please WhatsApp your CV instead.';
          }
        });
      }

      render();
    },
  };
})();
