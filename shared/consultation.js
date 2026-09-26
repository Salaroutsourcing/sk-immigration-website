/** Shared field definitions and validation for the candidate intake and Worker. */
export const services = [
  ["study-visa", "Study abroad", "University & language programmes", "01"],
  ["ausbildung", "Work & training", "Skilled work & Ausbildung", "02"],
  ["visit-visa", "Visit & travel", "Travel and visitor visa guidance", "03"],
  [
    "company-registration",
    "Start a business",
    "Company formation abroad",
    "04",
  ],
  ["saudi-work", "Saudi visa support", "For an existing sponsor process", "05"],
  ["other", "Other guidance", "Documents, appointments & more", "06"],
];
export const fields = [
  {
    key: "destination",
    label: "Preferred destination",
    step: 0,
    required: true,
    options: [
      "Germany",
      "United Kingdom",
      "Canada",
      "Australia",
      "United States",
      "UAE",
      "Saudi Arabia",
      "Italy",
      "France",
      "Other",
      "Help me choose",
    ],
  },
  {
    key: "timeline",
    label: "When would you like to start?",
    step: 0,
    required: true,
    options: [
      "As soon as practical",
      "Within 3 months",
      "Within 6 months",
      "Within 12 months",
      "Just exploring",
    ],
  },
  {
    key: "name",
    label: "Full name",
    step: 1,
    required: true,
    autocomplete: "name",
    max: 120,
  },
  {
    key: "email",
    label: "Email address",
    step: 1,
    required: true,
    type: "email",
    autocomplete: "email",
    max: 254,
  },
  {
    key: "phone",
    label: "WhatsApp / phone number",
    step: 1,
    required: true,
    type: "tel",
    autocomplete: "tel",
    placeholder: "+92 300 1234567",
    max: 30,
  },
  {
    key: "current_location",
    label: "Current city & country",
    step: 1,
    required: true,
    autocomplete: "address-level2",
    placeholder: "e.g. Lahore, Pakistan",
    max: 150,
  },
  {
    key: "contact_method",
    label: "Preferred way to contact you",
    step: 1,
    required: true,
    options: ["WhatsApp", "Email", "Phone call"],
  },
  {
    key: "contact_time",
    label: "Best time to reach you (optional)",
    step: 1,
    placeholder: "e.g. Weekdays 5–8 pm, Pakistan time",
    max: 150,
  },
  {
    key: "education",
    label: "Highest qualification",
    step: 2,
    required: true,
    services: ["study-visa", "ausbildung"],
    options: [
      "Secondary school",
      "Higher secondary / Intermediate",
      "Diploma",
      "Bachelor’s degree",
      "Master’s degree",
      "Doctorate",
      "Other",
    ],
  },
  {
    key: "study_goal",
    label: "Intended programme / field",
    step: 2,
    required: true,
    services: ["study-visa"],
    placeholder: "e.g. Master’s in Computer Science",
    max: 200,
  },
  {
    key: "grades",
    label: "Grades / CGPA and scale (optional)",
    step: 2,
    services: ["study-visa"],
    placeholder: "e.g. 3.2 / 4.0 or 75%",
    max: 80,
  },
  {
    key: "language",
    label: "Language preparation",
    step: 2,
    required: true,
    services: ["study-visa", "ausbildung"],
    options: [
      "Not started",
      "Currently preparing",
      "IELTS / TOEFL completed",
      "German certificate completed",
      "Other qualification",
    ],
  },
  {
    key: "language_score",
    label: "Language score / level (optional)",
    step: 2,
    services: ["study-visa", "ausbildung"],
    placeholder: "e.g. IELTS 6.5 or German B1",
    max: 100,
  },
  {
    key: "profession",
    label: "Profession / field of work",
    step: 2,
    required: true,
    services: ["ausbildung", "saudi-work"],
    max: 150,
  },
  {
    key: "experience",
    label: "Work experience",
    step: 2,
    required: true,
    services: ["ausbildung", "saudi-work"],
    options: [
      "No experience yet",
      "Less than 1 year",
      "1–3 years",
      "4–6 years",
      "7+ years",
    ],
  },
  {
    key: "sponsor_initiated",
    label: "Has a Saudi sponsor started your process?",
    step: 2,
    required: true,
    services: ["saudi-work"],
    options: ["Yes", "No", "Not sure"],
  },
  {
    key: "travel_purpose",
    label: "Purpose of visit",
    step: 2,
    required: true,
    services: ["visit-visa"],
    options: ["Tourism", "Visit family or friends", "Business visit", "Other"],
  },
  {
    key: "business_goal",
    label: "Tell us about your business",
    step: 2,
    required: true,
    services: ["company-registration"],
    max: 400,
  },
  {
    key: "company_status",
    label: "Business stage",
    step: 2,
    required: true,
    services: ["company-registration"],
    options: [
      "Starting a new company",
      "Expanding an existing business",
      "Exploring options",
    ],
  },
  {
    key: "application_stage",
    label: "Where are you in the process?",
    step: 2,
    required: true,
    options: [
      "Researching options",
      "Preparing documents",
      "Ready to apply",
      "Already applied",
      "Need help after a refusal",
    ],
  },
  {
    key: "documents",
    label: "Document readiness",
    step: 2,
    required: true,
    options: [
      "Not started",
      "Some documents ready",
      "All relevant documents ready",
      "Need a checklist",
    ],
  },
  {
    key: "message",
    label: "Anything else we should know? (optional)",
    step: 2,
    type: "textarea",
    placeholder:
      "Your goals, questions, or the support you need. Please leave out passport numbers and bank details.",
    max: 2000,
  },
];
export function activeFields(service) {
  return fields.filter((f) => !f.services || f.services.includes(service));
}
export function validateConsultation(data, step) {
  /** @type {Record<string, string>} */
  const errors = {};
  if (
    (step === undefined || step === 0) &&
    !services.some((s) => s[0] === data.service)
  )
    errors.service = "Choose the support you need.";
  for (const field of activeFields(data.service)) {
    if (step !== undefined && field.step !== step) continue;
    const value =
      typeof data[field.key] === "string" ? data[field.key].trim() : "";
    if (field.required && !value)
      errors[field.key] = `Please complete ${field.label.toLowerCase()}.`;
    else if (value && field.options && !field.options.includes(value))
      errors[field.key] = "Choose one of the available options.";
    else if (value.length > (field.max || 200))
      errors[field.key] = `Use ${field.max || 200} characters or fewer.`;
  }
  if (step === undefined || step === 1) {
    if (
      typeof data.email === "string" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())
    )
      errors.email = "Enter a valid email address.";
    if (
      typeof data.phone === "string" &&
      !/^\+[1-9][\d ()-]{6,28}$/.test(data.phone.trim())
    )
      errors.phone =
        "Include + and your country code, for example +92 300 1234567.";
    else if (
      typeof data.phone === "string" &&
      !/^\d{7,15}$/.test(data.phone.replace(/\D/g, ""))
    )
      errors.phone = "Use 7–15 digits, including your country code.";
  }
  if ((step === undefined || step === 3) && data.consent !== true)
    errors.consent = "Please agree so we can respond to your request.";
  return errors;
}
export function cleanConsultation(data) {
  return Object.fromEntries([
    ["form_version", "consultation-v1"],
    ["service", data.service],
    ["consent", data.consent === true],
    ...activeFields(data.service).map((f) => [
      f.key,
      typeof data[f.key] === "string" ? data[f.key].trim() : "",
    ]),
  ]);
}
