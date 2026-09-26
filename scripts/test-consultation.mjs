import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";
import {
  activeFields,
  cleanConsultation,
  services,
  validateConsultation,
} from "../shared/consultation.js";

function valid(service = "study-visa") {
  const data = { service, consent: true };
  for (const field of activeFields(service)) {
    if (field.required)
      data[field.key] = field.options?.[0] || "Test candidate";
  }
  return { ...data, email: "candidate@example.com", phone: "+92 300 1234567" };
}
function environment({ count = 0, fail = false } = {}) {
  const writes = [];
  return {
    writes,
    SESSION_SECRET: "local-test-only",
    DB: {
      prepare(sql) {
        return {
          bind(...values) {
            return {
              first: async () => ({ n: count }),
              run: async () => {
                if (fail) throw new Error("Test storage failure");
                writes.push({ sql, values });
              },
            };
          },
        };
      },
    },
  };
}
async function submit(data, env = environment(), extras = {}) {
  const response = await worker.fetch(
    new Request("https://example.com/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "consultation", data, ...extras }),
    }),
    env,
    { waitUntil() {} },
  );
  return { status: response.status, body: await response.json(), env };
}
for (const [service] of services)
  test(`accepts a complete ${service} profile and persists contact queue details`, async () => {
    const { status, body, env } = await submit(valid(service));
    assert.equal(status, 200);
    assert.equal(body.ok, true);
    assert.ok(body.id);
    assert.equal(env.writes.length, 1);
    assert.equal(env.writes[0].values[3], "contact");
    const stored = JSON.parse(env.writes[0].values[8]);
    assert.equal(stored.service, service);
    assert.equal(stored.form_version, "consultation-v1");
    assert.equal(stored.consent, true);
    assert.ok(stored.consent_at);
  });
test("rejects missing and malformed fields without writing a lead", async () => {
  const { status, body, env } = await submit({
    service: "study-visa",
    email: "wrong",
    phone: "03001234567",
  });
  assert.equal(status, 400);
  assert.ok(body.fields.email);
  assert.ok(body.fields.phone);
  assert.ok(body.fields.education);
  assert.ok(body.fields.consent);
  assert.equal(env.writes.length, 0);
});
test("requires real boolean consent and valid option values", () => {
  assert.ok(validateConsultation({ ...valid(), consent: "true" }).consent);
  assert.ok(
    validateConsultation({ ...valid(), destination: "injected-option" })
      .destination,
  );
  assert.ok(validateConsultation({ ...valid(), name: "x".repeat(121) }).name);
});
test("changing service omits stale answers and unrelated data", () => {
  const clean = cleanConsultation({
    ...valid("visit-visa"),
    education: "old qualification",
    arbitrary: "discard",
  });
  assert.equal(clean.education, undefined);
  assert.equal(clean.arbitrary, undefined);
  assert.equal(validateConsultation(clean).education, undefined);
});
test("honeypot submissions never write a lead", async () => {
  const { body, env } = await submit(valid(), environment(), { sk_hp: "bot" });
  assert.equal(body.skipped, true);
  assert.equal(body.id, null);
  assert.equal(env.writes.length, 0);
});
test("rate limiting does not write another lead", async () => {
  const { status, env } = await submit(valid(), environment({ count: 8 }));
  assert.equal(status, 429);
  assert.equal(env.writes.length, 0);
});
test("missing storage returns a failure rather than success", async () => {
  const { status, body } = await submit(valid(), {});
  assert.equal(status, 503);
  assert.equal(body.ok, false);
});
test("storage write failures never report receipt", async () => {
  const { status, body } = await submit(valid(), environment({ fail: true }));
  assert.equal(status, 500);
  assert.equal(body.ok, false);
});
test("legacy contact requests keep their original contract", async () => {
  const { status } = await submit(
    { name: "Legacy test", phone: "03001234567" },
    environment(),
    { type: "contact" },
  );
  assert.equal(status, 200);
});
