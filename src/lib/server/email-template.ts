/**
 * Enquiry emails sent to the Sinking Fund team: the same layout as the BIV Reports emails
 * (logo band, heading, service chips, grouped panels, Reply / Call buttons, footer),
 * in the Sinking Fund colours. Table-based with inline styles so it renders in Outlook, Gmail and Apple Mail.
 *
 * Shared by the Next.js site (src/lib/server) and the HTML version (src/server): keep both copies identical.
 */
import { optionLabel, type FormDefinition, type FormValues } from "../forms/schema";
import { EMAIL_LOGO_PNG_BASE64 } from "./email-logo";

export interface EmailAttachment {
  filename: string;
  /** base64 */
  content: string;
  cid: string;
  contentType: string;
}

const FONT = "Montserrat,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const C = {
  page: "#e6ecee",
  card: "#fafbfb",
  panel: "#eef3f4",
  band: "#e4edee",
  brand: "#08707f", // teal ink: labels and links
  action: "#db3a1b", // signal red: the main button, as on the site
  ink: "#272727",
  body: "#4a4f50",
  mute: "#6b7172",
  line: "#d9e1e3",
};

const h = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Row = { key: string; label: string; kind?: "email" | "tel" | "long" | "multi" };
type Panel = { title: string; rows: Row[] };

/** Which fields go in which panel, with short labels for the email. */
const LAYOUT: Record<"contact" | "quote", { chips: string; name: string; email: string; phone: string[]; panels: Panel[] }> = {
  contact: {
    chips: "enquiryTypes",
    name: "name",
    email: "email",
    phone: ["phone"],
    panels: [
      {
        title: "Contact",
        rows: [
          { key: "email", label: "Email", kind: "email" },
          { key: "phone", label: "Phone", kind: "tel" },
          { key: "contactPreference", label: "Prefers", kind: "multi" },
        ],
      },
      {
        title: "Enquiry",
        rows: [
          { key: "subject", label: "Subject" },
          { key: "message", label: "Message", kind: "long" },
        ],
      },
    ],
  },
  quote: {
    chips: "services",
    name: "managerName",
    email: "managerEmail",
    phone: ["managerPhone"],
    panels: [
      {
        title: "Strata Manager",
        rows: [
          { key: "managerCompany", label: "Company" },
          { key: "managerEmail", label: "Email", kind: "email" },
          { key: "managerPhone", label: "Phone", kind: "tel" },
          { key: "managerAddress", label: "Address" },
          { key: "replyPreference", label: "Prefers", kind: "multi" },
        ],
      },
      {
        title: "Property",
        rows: [
          { key: "siteAddress", label: "Address" },
          { key: "numberOfLots", label: "Lots" },
          { key: "strataPlanNumber", label: "Strata plan" },
        ],
      },
      {
        title: "Site Access",
        rows: [
          { key: "siteContactName", label: "Contact" },
          { key: "siteContactPhone", label: "Phone", kind: "tel" },
          { key: "siteContactMobile", label: "Mobile", kind: "tel" },
          { key: "siteContactAddress", label: "Address" },
        ],
      },
    ],
  },
};

function display(def: FormDefinition, values: FormValues, key: string): string {
  const v = values[key];
  if (Array.isArray(v)) return v.map((x) => optionLabel(def, key, x)).join(", ");
  return (v ?? "").trim();
}

export function renderEmail(def: FormDefinition, values: FormValues, reference: string, site = "sinkingfundplan.com.au") {
  const form = def.id === "contact" ? "contact" : "quote";
  const L = LAYOUT[form];
  const val = (key: string) => (def.fields[key] ? display(def, values, key) : "");
  const dash = `<span style="color:${C.mute}">—</span>`;
  const link = (href: string, text: string) => `<a href="${h(href)}" style="color:${C.brand};text-decoration:none;font-weight:700">${h(text)}</a>`;
  const tel = (s: string) => s.replace(/[^\d+]/g, "");

  const cell = (r: Row) => {
    const v = val(r.key);
    if (!v) return dash;
    if (r.kind === "email") return link(`mailto:${v}`, v);
    if (r.kind === "tel") return link(`tel:${tel(v)}`, v);
    if (r.kind === "long") return `<span style="white-space:pre-wrap;color:${C.body}">${h(v)}</span>`;
    return h(v);
  };
  const row = (r: Row) =>
    `<tr><td style="padding:2px 0;width:28%;vertical-align:top;font:600 10px/1.7 ${FONT};letter-spacing:.06em;text-transform:uppercase;color:${C.mute}">${h(r.label)}</td>` +
    `<td style="padding:2px 0;vertical-align:top;font:500 13px/1.45 ${FONT};color:${C.ink}">${cell(r)}</td></tr>`;
  const panel = (title: string, inner: string) =>
    `<tr><td style="padding:0 20px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.panel};border-radius:8px">` +
    `<tr><td style="padding:8px 12px 2px;font:700 10px/1 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${C.brand}">${h(title)}</td></tr>` +
    `<tr><td style="padding:2px 12px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${inner}</table></td></tr></table></td></tr>`;

  const name = val(L.name) || "Website visitor";
  const company = form === "quote" ? val("managerCompany") : "";
  const first = name.split(/\s+/)[0] || "them";
  const email = val(L.email);
  const phone = L.phone.map(val).find(Boolean) || (form === "quote" ? val("siteContactPhone") || val("siteContactMobile") : "");
  const heading = `${form === "contact" ? "Website Enquiry" : "Quote Request"} from ${name}${company ? `, ${company}` : ""}`;
  const when = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date());
  const chipValues = Array.isArray(values[L.chips]) ? (values[L.chips] as string[]).map((x) => optionLabel(def, L.chips, x)) : [];
  const chips = chipValues
    .map((c) => `<span style="display:inline-block;margin:0 4px 4px 0;padding:3px 10px;border-radius:999px;background:${C.panel};border:1px solid ${C.line};color:${C.ink};font:600 11px/1.3 ${FONT}">${h(c)}</span>`)
    .join("");
  const buttons =
    `<table role="presentation" cellpadding="0" cellspacing="0"><tr>` +
    (email ? `<td style="padding:0 8px 4px 0"><a href="mailto:${h(email)}" style="display:inline-block;padding:9px 16px;border-radius:999px;background:${C.action};color:#ffffff;text-decoration:none;font:700 12px/1 ${FONT}">Reply to ${h(first)}</a></td>` : "") +
    (phone ? `<td style="padding:0 0 4px"><a href="tel:${h(tel(phone))}" style="display:inline-block;padding:8px 14px;border-radius:999px;border:1.5px solid ${C.brand};color:${C.brand};text-decoration:none;font:700 12px/1 ${FONT}">Call ${h(phone)}</a></td>` : "") +
    `</tr></table>`;

  const special = form === "quote" ? val("specialInstructions") : "";
  const preview = [name, company, phone || email, form === "quote" ? val("siteAddress") : val("subject")].filter(Boolean).join(" · ");

  const html =
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${h(heading)}</title></head>` +
    `<body style="margin:0;padding:0;background:${C.page}">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${h(preview)}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}"><tr><td align="center" style="padding:12px 8px">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.card};border-radius:14px;overflow:hidden;border:1px solid ${C.line}">` +
    // logo band
    `<tr><td style="background:${C.band};padding:10px 20px;border-bottom:1px solid ${C.line}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>` +
    `<td><img src="cid:sf-logo" width="156" height="26" alt="Sinking Fund" style="display:block;border:0;height:auto"></td>` +
    `<td align="right" style="font:500 12px/1.4 ${FONT};color:${C.mute}">${h(when)}</td></tr></table></td></tr>` +
    // heading and chips
    `<tr><td style="padding:14px 20px 6px"><h1 style="margin:0;font:700 19px/1.25 ${FONT};letter-spacing:-.01em;color:${C.ink}">${h(heading)}</h1></td></tr>` +
    (chips ? `<tr><td style="padding:2px 20px 4px">${chips}</td></tr>` : "") +
    // panels
    L.panels.map((p) => panel(p.title, p.rows.filter((r) => def.fields[r.key]).map(row).join(""))).join("") +
    (special ? panel("Special Instructions", `<tr><td style="padding:2px 0;font:500 13px/1.45 ${FONT};color:${C.body};white-space:pre-wrap">${h(special)}</td></tr>`) : "") +
    // buttons and footer
    `<tr><td style="padding:4px 20px 12px">${buttons}</td></tr>` +
    `<tr><td style="background:${C.band};padding:8px 20px;border-top:1px solid ${C.line};font:500 10px/1.6 ${FONT};color:${C.mute}">` +
    `Sent from the ${form} form at ${h(site)} · Reference ${h(reference)} · Reply to answer ${h(first)} directly.</td></tr>` +
    `</table></td></tr></table></body></html>`;

  // Plain-text version: "Label:" then the value, one block per field.
  const rows = def.order.map((key) => ({ label: def.fields[key].label, value: display(def, values, key) || "—" }));
  const text = `${heading} (reference ${reference})\n\n` + rows.map((r) => `${r.label}:\n${r.value}\n`).join("\n");

  const attachments: EmailAttachment[] = [{ filename: "sinking-fund-logo.png", content: EMAIL_LOGO_PNG_BASE64, cid: "sf-logo", contentType: "image/png" }];
  return { text, html, attachments };
}
