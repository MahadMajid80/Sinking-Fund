/**
 * Shared form definitions and validation for the Contact and Quote forms.
 * Used on the client (inline errors) and on the server (authoritative validation).
 * Deliberately dependency-free to keep the client bundle small.
 */

/** The seven original service labels, verbatim from both Contact Form 7 forms. */
export const SERVICE_OPTIONS = [
  { value: "biv", label: "Building Insurance Valuation" },
  { value: "asbestos", label: "Asbestos Report" },
  { value: "whs", label: "WHS Report" },
  { value: "ohs-vic", label: "OHS Report (VIC)" },
  { value: "window-safety", label: "Window Safety Report" },
  { value: "sfp", label: "Sinking Fund Plan" },
  { value: "maintenance-plan-vic", label: "Maintenance Plan (VIC)" },
] as const;
export type ServiceValue = (typeof SERVICE_OPTIONS)[number]["value"];

/** Maps service page keys to the quote form value that should be preselected. */
export const SERVICE_PAGE_TO_OPTION: Record<string, ServiceValue> = {
  biv: "biv",
  sfp: "sfp",
  whs: "whs",
  asb: "asbestos",
};

/** Contact form preference options (export value "Email  back" contained a double space). */
export const CONTACT_PREFERENCES = [
  { value: "call-back", label: "Call back" },
  { value: "email-back", label: "Email back" },
  { value: "send-info", label: "Send info" },
] as const;

/** Quote form reply preference options. */
export const QUOTE_PREFERENCES = [
  { value: "call-back", label: "Call back" },
  { value: "email-back", label: "Email back" },
] as const;

export const LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  subject: 150,
  message: 5000,
  company: 150,
  address: 300,
  strataPlan: 50,
  lots: 6,
  instructions: 3000,
  /** Maximum accepted request body in bytes. */
  payloadBytes: 32 * 1024,
} as const;

export type FieldErrors = Record<string, string>;

type FieldSpec =
  | { kind: "text"; label: string; required?: boolean; max: number; pattern?: RegExp; patternMessage?: string }
  | { kind: "email"; label: string; required?: boolean }
  | { kind: "tel"; label: string; required?: boolean }
  | { kind: "multi"; label: string; options: readonly { value: string; label: string }[]; min?: number; minMessage?: string };

export interface FormDefinition {
  id: "contact" | "quote";
  fields: Record<string, FieldSpec>;
  /** Field order for email output and the error summary. */
  order: string[];
}

export const contactForm: FormDefinition = {
  id: "contact",
  order: ["name", "email", "phone", "contactPreference", "enquiryTypes", "subject", "message"],
  fields: {
    name: { kind: "text", label: "Your name", required: true, max: LIMITS.name },
    email: { kind: "email", label: "Your email", required: true },
    phone: { kind: "tel", label: "Your phone number" },
    contactPreference: {
      kind: "multi",
      label: "Preference",
      options: CONTACT_PREFERENCES,
      min: 1,
      minMessage: "Choose at least one way for us to respond.",
    },
    enquiryTypes: { kind: "multi", label: "Is your query regarding any of the following?", options: SERVICE_OPTIONS },
    subject: { kind: "text", label: "Subject", max: LIMITS.subject },
    message: { kind: "text", label: "Your message", max: LIMITS.message },
  },
};

export const quoteForm: FormDefinition = {
  id: "quote",
  order: [
    "services",
    "strataPlanNumber",
    "numberOfLots",
    "siteAddress",
    "managerName",
    "managerCompany",
    "managerPhone",
    "managerEmail",
    "managerAddress",
    "siteContactName",
    "siteContactPhone",
    "siteContactMobile",
    "siteContactAddress",
    "specialInstructions",
    "replyPreference",
  ],
  fields: {
    services: {
      kind: "multi",
      label: "Services required",
      options: SERVICE_OPTIONS,
      min: 1,
      minMessage: "Select at least one service to quote.",
    },
    strataPlanNumber: { kind: "text", label: "Strata plan number", max: LIMITS.strataPlan },
    numberOfLots: {
      kind: "text",
      label: "Number of lots",
      max: LIMITS.lots,
      pattern: /^\d{1,6}$/,
      patternMessage: "Enter the number of lots as a whole number, for example 12.",
    },
    siteAddress: { kind: "text", label: "Site address", max: LIMITS.address },
    managerName: { kind: "text", label: "Strata manager name", required: true, max: LIMITS.name },
    managerCompany: { kind: "text", label: "Company", required: true, max: LIMITS.company },
    managerPhone: { kind: "tel", label: "Strata manager phone number" },
    managerEmail: { kind: "email", label: "Strata manager email", required: true },
    managerAddress: { kind: "text", label: "Strata manager address", required: true, max: LIMITS.address },
    siteContactName: { kind: "text", label: "Site contact name", required: true, max: LIMITS.name },
    siteContactPhone: { kind: "tel", label: "Site contact phone number" },
    siteContactMobile: { kind: "tel", label: "Site contact mobile number" },
    siteContactAddress: { kind: "text", label: "Site contact address", required: true, max: LIMITS.address },
    specialInstructions: { kind: "text", label: "Special instructions", max: LIMITS.instructions },
    replyPreference: { kind: "multi", label: "Preference", options: QUOTE_PREFERENCES },
  },
};

export type FormValues = Record<string, string | string[]>;

// Pragmatic email check: one @, no spaces, a dot in the domain, no consecutive dots.
const EMAIL_RE = /^[^\s@"<>(),;:]+@[^\s@"<>(),;:]+\.[^\s@"<>(),;:]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{6,}$/;
// Reject control characters other than tab/newline (header-injection and junk).
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export function isValidEmail(value: string): boolean {
  return value.length <= LIMITS.email && EMAIL_RE.test(value) && !value.includes("..");
}

/**
 * Normalises raw input into trimmed strings and de-duplicated, allow-listed arrays.
 * Unknown keys are dropped.
 */
export function normalise(def: FormDefinition, raw: Record<string, unknown>): FormValues {
  const out: FormValues = {};
  for (const key of def.order) {
    const spec = def.fields[key];
    const value = raw[key];
    if (spec.kind === "multi") {
      const list = Array.isArray(value) ? value : value == null || value === "" ? [] : [value];
      const allowed = new Set(spec.options.map((o) => o.value));
      out[key] = [...new Set(list.map((v) => String(v)).filter((v) => allowed.has(v)))];
    } else {
      out[key] = typeof value === "string" ? value.replace(/\r\n?/g, "\n").trim() : value == null ? "" : String(value).trim();
    }
  }
  return out;
}

export function validate(def: FormDefinition, values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  for (const key of def.order) {
    const spec = def.fields[key];
    const value = values[key];
    if (spec.kind === "multi") {
      const list = Array.isArray(value) ? value : [];
      if (spec.min && list.length < spec.min) errors[key] = spec.minMessage ?? `Select at least ${spec.min}.`;
      continue;
    }
    const v = typeof value === "string" ? value : "";
    if (!v) {
      if (spec.required) errors[key] = `Enter ${spec.label.toLowerCase()}.`;
      continue;
    }
    if (CONTROL_RE.test(v)) {
      errors[key] = `${spec.label} contains characters we can't accept.`;
      continue;
    }
    if (spec.kind === "email") {
      if (!isValidEmail(v)) errors[key] = "Enter an email address in the format name@example.com.";
    } else if (spec.kind === "tel") {
      if (v.length > LIMITS.phone || !PHONE_RE.test(v) || (v.match(/\d/g)?.length ?? 0) < 6)
        errors[key] = "Enter a phone number using digits, spaces and an optional +, for example 02 9114 9800.";
    } else {
      if (v.length > spec.max) errors[key] = `${spec.label} must be ${spec.max} characters or fewer.`;
      else if (spec.kind === "text" && spec.pattern && !spec.pattern.test(v)) errors[key] = spec.patternMessage ?? "Check this field.";
      else if (key !== "message" && key !== "specialInstructions" && key !== "managerAddress" && key !== "siteContactAddress" && key !== "siteAddress" && v.includes("\n"))
        errors[key] = `${spec.label} must be on one line.`;
    }
  }
  return errors;
}

/** Human-readable label for a stored option value. */
export function optionLabel(def: FormDefinition, key: string, value: string): string {
  const spec = def.fields[key];
  if (spec?.kind === "multi") return spec.options.find((o) => o.value === value)?.label ?? value;
  return value;
}

export const HONEYPOT_FIELD = "website";
/** Minimum milliseconds between rendering the form and submitting it. */
export const MIN_FILL_MS = 2500;

/* ---------- Steps ----------
   Both forms are shown one step at a time when JavaScript runs. Steps only group the fields;
   validation rules, field names and the server contract are unchanged. Without JavaScript all
   steps are shown on one page. */

export interface FormStep {
  id: string;
  title: string;
  /** One sentence shown under the step title. */
  intro: string;
  fields: string[];
}

export const contactSteps: FormStep[] = [
  { id: "about", title: "About you", intro: "Tell us who you are and how to reach you.", fields: ["name", "email", "phone"] },
  { id: "enquiry", title: "Your enquiry", intro: "Let us know what your question is about.", fields: ["enquiryTypes", "subject", "message"] },
  { id: "reply", title: "How we reply", intro: "Choose how you’d like us to respond, then check your details.", fields: ["contactPreference"] },
];

export const quoteSteps: FormStep[] = [
  { id: "job", title: "Services and site", intro: "Choose the services to quote and tell us about the property.", fields: ["services", "strataPlanNumber", "numberOfLots", "siteAddress"] },
  { id: "manager", title: "Strata manager", intro: "Who should we send the quote to?", fields: ["managerName", "managerCompany", "managerPhone", "managerEmail", "managerAddress"] },
  { id: "site", title: "Site access contact", intro: "Who can give our valuer access to the property?", fields: ["siteContactName", "siteContactPhone", "siteContactMobile", "siteContactAddress"] },
  { id: "final", title: "Final details", intro: "Add any instructions and how you’d like us to reply, then check your details.", fields: ["specialInstructions", "replyPreference"] },
];

/** Index of the step that holds a field, or -1. */
export function stepOf(steps: FormStep[], field: string): number {
  return steps.findIndex((s) => s.fields.includes(field));
}

/** The first step that has an error, or -1. */
export function firstStepWithError(steps: FormStep[], errors: FieldErrors): number {
  return steps.findIndex((s) => s.fields.some((f) => errors[f]));
}

/** Errors that belong to one step. */
export function errorsForStep(step: FormStep, errors: FieldErrors): FieldErrors {
  return Object.fromEntries(Object.entries(errors).filter(([k]) => step.fields.includes(k)));
}

/** A field's value as a person would read it on the review step ("" when left empty). */
export function displayValue(def: FormDefinition, field: string, value: string | string[] | undefined): string {
  const spec = def.fields[field];
  if (!spec || value === undefined) return "";
  if (spec.kind === "multi") {
    const list = Array.isArray(value) ? value : [value];
    return list.map((v) => spec.options.find((o) => o.value === v)?.label ?? v).filter(Boolean).join(", ");
  }
  return (Array.isArray(value) ? value.join(", ") : value).trim();
}
