import { useEffect, useRef, useState } from "react";
import {
  activeFields,
  cleanConsultation,
  services,
  validateConsultation,
} from "../../../shared/consultation.js";
import "./consultation.css";

const steps = ["Your plans", "About you", "Your background", "Review & submit"];
const titles = [
  "Where will your next chapter begin?",
  "Let’s get to know you.",
  "A little context. Better guidance.",
  "Everything look right?",
];
const descriptions = [
  "Choose the support you need. We’ll tailor the next questions to your plans.",
  "Tell us how to reach you with guidance for your situation.",
  "Help our team understand where you are and what you need next.",
  "Check your details before sending them to the SK Immigration team.",
];
type Answers = Record<string, string | boolean>;

export default function ConsultationForm({
  whatsappLink,
}: {
  whatsappLink: string;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Answers>({ service: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  const [reference, setReference] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const firstRender = useRef(true);
  const hp = useRef<HTMLInputElement>(null);
  const currentFields = activeFields(data.service);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [step, reference]);
  function change(key: string, value: string | boolean) {
    setData((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
    setFailure("");
  }
  function go(next: number) {
    setErrors({});
    setFailure("");
    setStep(next);
  }
  function showErrors(next: Record<string, string>) {
    setErrors(next);
    requestAnimationFrame(() => errorBox.current?.focus());
  }
  async function advance(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || reference) return;
    const nextErrors = validateConsultation(
      data,
      step === 3 ? undefined : step,
    );
    if (Object.keys(nextErrors).length) {
      showErrors(nextErrors);
      return;
    }
    if (step < 3) {
      go(step + 1);
      return;
    }
    busy.current = true;
    setPending(true);
    setFailure("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consultation",
          sk_hp: hp.current?.value || "",
          data: cleanConsultation(data),
        }),
      });
      const result = await response.json().catch(() => null);
      if (
        !response.ok ||
        !result?.ok ||
        typeof result.id !== "string" ||
        !result.id
      ) {
        if (result?.fields) {
          const firstKey = Object.keys(result.fields)[0];
          setStep(
            currentFields.find((f) => f.key === firstKey)?.step ??
              (firstKey === "service" ? 0 : 3),
          );
          showErrors(result.fields);
        }
        throw new Error(
          response.status === 429
            ? "Too many requests. Please wait 10 minutes before trying again, or contact us on WhatsApp."
            : "We couldn’t confirm your submission. Your answers are still here. Please try again or contact our team.",
        );
      }
      setReference(result.id);
      setData({ service: "", consent: false });
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : "We couldn’t send your request. Please try again.",
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  if (reference)
    return (
      <section
        className="consult-card consult-success"
        aria-labelledby="success-heading"
      >
        <span className="consult-success-icon" aria-hidden="true">
          ✓
        </span>
        <p className="consult-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h2 id="success-heading" tabIndex={-1} ref={heading}>
          Your request is with our team.
        </h2>
        <p>
          Thank you for choosing SK Immigration. We’ll review your details and
          contact you using your preferred method to discuss the next steps.
        </p>
        <div className="consult-reference">
          <span>Your reference number</span>
          <strong>{reference}</strong>
          <small>
            Keep this reference for any follow-up. No payment has been taken.
          </small>
        </div>
        <a
          className="consult-primary"
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Talk to our team ↗
        </a>
        <a className="consult-home" href="/">
          Back to home →
        </a>
      </section>
    );
  return (
    <section className="consult-card" aria-label="Candidate consultation form">
      <div className="consult-progress-top">
        <span>YOUR CONSULTATION</span>
        <span>Step {step + 1} of 4</span>
      </div>
      <ol className="consult-steps" aria-label="Application progress">
        {steps.map((label, i) => (
          <li
            key={label}
            aria-current={step === i ? "step" : undefined}
            className={i <= step ? "is-current" : ""}
          >
            <span>{i < step ? "✓" : `0${i + 1}`}</span>
            <small>{label}</small>
          </li>
        ))}
      </ol>
      <div className="consult-body">
        <h2 ref={heading} tabIndex={-1}>
          {titles[step]}
        </h2>
        <p className="consult-description">{descriptions[step]}</p>
        <form onSubmit={advance} noValidate aria-busy={pending}>
          <div className="consult-hp" aria-hidden="true">
            <label htmlFor="consult-company">Leave this field empty</label>
            <input
              ref={hp}
              id="consult-company"
              name="sk_hp"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          {Object.keys(errors).length > 0 && (
            <div
              ref={errorBox}
              tabIndex={-1}
              className="consult-error-summary"
              role="alert"
            >
              <strong>Please check the following:</strong>
              <ul>
                {Object.entries(errors).map(([key, text]) => (
                  <li key={key}>
                    <a href={`#consult-${key}`}>{text}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <fieldset disabled={pending} className="consult-fieldset">
            {step === 0 && (
              <fieldset
                className="consult-services"
                id="consult-service"
                aria-describedby={errors.service ? "error-service" : undefined}
              >
                <legend>
                  What would you like help with?{" "}
                  <span aria-hidden="true">*</span>
                </legend>
                <div className="consult-service-grid">
                  {services.map(([value, title, detail, number]) => (
                    <label
                      key={value}
                      className={data.service === value ? "selected" : ""}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={value}
                        checked={data.service === value}
                        onChange={() => change("service", value)}
                        aria-invalid={Boolean(errors.service)}
                      />
                      <span
                        className="consult-service-number"
                        aria-hidden="true"
                      >
                        {number}
                      </span>
                      <strong>{title}</strong>
                      <small>{detail}</small>
                    </label>
                  ))}
                </div>
                {errors.service && (
                  <p className="consult-field-error" id="error-service">
                    {errors.service}
                  </p>
                )}
              </fieldset>
            )}
            {step < 3 && (
              <div className="consult-fields">
                {currentFields
                  .filter((f) => f.step === step)
                  .map((field) => {
                    const props = {
                      id: `consult-${field.key}`,
                      name: field.key,
                      value: String(data[field.key] || ""),
                      required: field.required,
                      "aria-invalid": Boolean(errors[field.key]),
                      "aria-describedby": errors[field.key]
                        ? `error-${field.key}`
                        : undefined,
                      onChange: (
                        e: React.ChangeEvent<
                          | HTMLInputElement
                          | HTMLSelectElement
                          | HTMLTextAreaElement
                        >,
                      ) => change(field.key, e.target.value),
                    };
                    return (
                      <div
                        key={field.key}
                        className={
                          field.type === "textarea" ? "consult-wide" : ""
                        }
                      >
                        <label htmlFor={props.id}>
                          {field.label}
                          {field.required && <span aria-hidden="true"> *</span>}
                        </label>
                        {field.options ? (
                          <select {...props}>
                            <option value="">Select an option</option>
                            {field.options.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        ) : field.type === "textarea" ? (
                          <textarea
                            {...props}
                            rows={4}
                            maxLength={field.max}
                            placeholder={field.placeholder}
                          />
                        ) : (
                          <input
                            {...props}
                            type={field.type || "text"}
                            autoComplete={field.autocomplete}
                            maxLength={field.max}
                            placeholder={field.placeholder}
                          />
                        )}
                        {errors[field.key] && (
                          <p
                            id={`error-${field.key}`}
                            className="consult-field-error"
                          >
                            {errors[field.key]}
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
            {step === 2 && (
              <div className="consult-note">
                {data.service === "saudi-work"
                  ? "Saudi visa support requires a legitimate sponsor to initiate the process. We do not arrange or sell jobs. "
                  : data.service === "company-registration"
                    ? "Company registration does not automatically provide a visa or residency. "
                    : ""}
                No document uploads are needed at this stage. Our team will
                explain which documents to share during follow-up.
              </div>
            )}
            {step === 3 && (
              <>
                <div className="consult-review">
                  {steps.slice(0, 3).map((label, i) => (
                    <section key={label}>
                      <div className="consult-review-heading">
                        <h3>{label}</h3>
                        <button
                          type="button"
                          onClick={() => go(i)}
                          aria-label={`Edit ${label.toLowerCase()}`}
                        >
                          Edit ↗
                        </button>
                      </div>
                      <dl>
                        {i === 0 && (
                          <div>
                            <dt>Support needed</dt>
                            <dd>
                              {services.find((s) => s[0] === data.service)?.[1]}
                            </dd>
                          </div>
                        )}
                        {currentFields
                          .filter((f) => f.step === i)
                          .map((f) => (
                            <div key={f.key}>
                              <dt>{f.label.replace(" (optional)", "")}</dt>
                              <dd>{String(data[f.key] || "Not provided")}</dd>
                            </div>
                          ))}
                      </dl>
                    </section>
                  ))}
                </div>
                <label className="consult-consent">
                  <input
                    id="consult-consent"
                    type="checkbox"
                    checked={data.consent === true}
                    onChange={(e) => change("consent", e.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={
                      errors.consent ? "error-consent" : undefined
                    }
                  />
                  <span>
                    I agree that SK Immigration may use these details to assess
                    my enquiry and contact me about it, as described in the{" "}
                    <a
                      href="/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                    . *
                  </span>
                </label>
                {errors.consent && (
                  <p className="consult-field-error" id="error-consent">
                    {errors.consent}
                  </p>
                )}
                <p className="consult-fine-print">
                  Submitting this form does not guarantee admission, employment,
                  or a visa. Authorities make the final decisions.
                </p>
              </>
            )}
            {failure && (
              <div className="consult-error-summary" role="alert">
                {failure}{" "}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact us on WhatsApp ↗
                </a>
              </div>
            )}
            <div className="consult-actions">
              {step > 0 ? (
                <button
                  className="consult-back"
                  type="button"
                  onClick={() => go(step - 1)}
                >
                  ← Back
                </button>
              ) : (
                <span className="consult-required">* Required fields</span>
              )}
              <button className="consult-primary" type="submit">
                {pending
                  ? "Sending your request…"
                  : step === 3
                    ? "Submit my request →"
                    : "Continue →"}
              </button>
            </div>
          </fieldset>
        </form>
        <p className="consult-bottom-note">
          Your details are sent only when you select “Submit my request”.
        </p>
      </div>
    </section>
  );
}
