# Candidate consultation form

The public `/contact/` page now provides a four-step candidate intake. `/consultation/` is a shareable alias with `/contact/` as its canonical URL. Existing assessment buttons already point to `/contact/`.

Candidates choose a service and destination, enter contact details, answer service-specific background questions, and review/edit the complete profile before consenting and submitting. Answers stay in React memory while moving between steps and after failed submissions; they are not saved in browser storage and refreshing clears them. No data is posted until final submission. Document readiness is collected; document uploads are deliberately not part of this initial enquiry. Staff can request relevant copies during follow-up.

## Delivery and operations

- The browser posts `type: consultation` to the existing `/api/lead` endpoint.
- Shared rules in `shared/consultation.js` validate the candidate data in both the browser and Worker. Inapplicable service fields are discarded.
- The Worker stores requests as `contact` leads so existing CRM contact filters continue to work. The JSON payload includes `form_version: consultation-v1`, the candidate profile, consent, and a server timestamp.
- The existing D1 `DB` binding and `SESSION_SECRET` are required, as for existing lead submissions. No schema migration or new secret is needed.
- The existing optional `LEAD_WEBHOOK_URL` receives the profile through the normal lead notification path. This change does not configure email delivery or add a new third-party form service.
- Confirmation includes the stored lead ID and only appears after a successful database response. Errors preserve the profile and offer retry/WhatsApp support.
- Existing honeypot and IP rate limiting apply. The UI rejects fake honeypot success responses without an ID and prevents simultaneous submissions.

## Verification

```sh
node --test scripts/test-consultation.mjs
npm run check
npm run build
npm run check:launch
```

The automated suite exercises all six service paths, required/invalid values, consent, stale field cleanup, persistence, rate limits, honeypots, unavailable/failing storage, and legacy contact compatibility.

For an interactive test, run local D1 migration (`npm run db:migrate:local`), set a local `SESSION_SECRET` in `.dev.vars`, and use `npm run cf:dev`. Use only synthetic candidate data. `npm run dev` serves the interface without the Worker API, so final submission there correctly shows an error.
