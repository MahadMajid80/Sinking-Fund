"use client";

import type { ReactNode } from "react";
import { HONEYPOT_FIELD, type FieldErrors, type FormDefinition } from "@/lib/forms/schema";
import { BRAND } from "@/lib/site";
import type { Status } from "./useEnquiryForm";

const Req = () => <span className="field__req"> (required)</span>;

export function TextField({
  id,
  name,
  label,
  required,
  error,
  type = "text",
  autoComplete,
  hint,
  multiline,
  maxLength,
  inputMode,
  rows = 6,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  hint?: string;
  multiline?: boolean;
  maxLength?: number;
  inputMode?: "numeric" | "text" | "email" | "tel";
  rows?: number;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    required,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    autoComplete,
    maxLength,
  };
  return (
    <div className={`field${error ? " field--error" : ""}${multiline ? " field--wide" : ""}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {required ? <Req /> : null}
      </label>
      {hint ? (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field__error">
          <span className="visually-hidden">Error: </span>
          {error}
        </p>
      ) : null}
      {multiline ? <textarea {...common} rows={rows} className="field__input" /> : <input {...common} type={type} inputMode={inputMode} className="field__input" />}
    </div>
  );
}

export function CheckboxGroup({
  id,
  name,
  legend,
  options,
  required,
  error,
  hint,
  values,
  onChange,
  columns,
}: {
  id: string;
  name: string;
  legend: ReactNode;
  options: readonly { value: string; label: string }[];
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  values?: string[];
  onChange?: (values: string[]) => void;
  columns?: boolean;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <fieldset className={`choices${error ? " choices--error" : ""}`} aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}>
      <legend className="field__label">
        {legend}
        {required ? <Req /> : null}
      </legend>
      {hint ? (
        <div id={hintId} className="field__hint">
          {hint}
        </div>
      ) : null}
      {error ? (
        <p id={errorId} className="field__error">
          <span className="visually-hidden">Error: </span>
          {error}
        </p>
      ) : null}
      <div className={`choices__options${columns ? " choices__options--columns" : ""}`}>
        {options.map((o, i) => (
          <div className="choice" key={o.value}>
            <input
              type="checkbox"
              id={i === 0 ? id : `${id}-${o.value}`}
              name={name}
              value={o.value}
              {...(values && onChange
                ? {
                    checked: values.includes(o.value),
                    onChange: (e) => onChange(e.target.checked ? [...values, o.value] : values.filter((v) => v !== o.value)),
                  }
                : {})}
            />
            <label htmlFor={i === 0 ? id : `${id}-${o.value}`}>{o.label}</label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

/** Off-screen field that people never see; bots that fill it are dropped server-side. */
export function Honeypot() {
  return (
    <div className="hp" aria-hidden="true">
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function ErrorSummary({
  def,
  status,
  errors,
  message,
  summaryRef,
  fieldIds,
}: {
  def: FormDefinition;
  status: Status;
  errors: FieldErrors;
  message: string;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  fieldIds: Record<string, string>;
}) {
  const keys = def.order.filter((k) => errors[k]);
  if (status === "invalid" && keys.length) {
    return (
      <div ref={summaryRef} tabIndex={-1} className="form-alert form-alert--error" role="alert" aria-labelledby={`${def.id}-summary-title`}>
        <h2 id={`${def.id}-summary-title`}>
          {keys.length === 1 ? "There is a problem with 1 field" : `There are problems with ${keys.length} fields`}
        </h2>
        <ul>
          {keys.map((k) => (
            <li key={k}>
              <a href={`#${fieldIds[k]}`}>{errors[k]}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (status === "failed" || status === "rate_limited") {
    return (
      <div ref={summaryRef} tabIndex={-1} className="form-alert form-alert--error" role="alert" aria-labelledby={`${def.id}-failed-title`}>
        <h2 id={`${def.id}-failed-title`}>{status === "rate_limited" ? "Please wait before sending again" : "Your message was not sent"}</h2>
        <p>{message}</p>
        <p>
          You can also call us on <a href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a>.
        </p>
      </div>
    );
  }
  return null;
}

export function SubmitRow({ status, label }: { status: Status; label: string }) {
  const pending = status === "pending";
  return (
    <div className="form-submit">
      <button type="submit" className="button button--primary" aria-disabled={pending || undefined} data-pending={pending || undefined}>
        {pending ? "Sending…" : label}
      </button>
      <p className="form-submit__status" role="status" aria-live="polite">
        {pending ? "Sending your details. Please keep this page open." : ""}
      </p>
    </div>
  );
}

export function SuccessPanel({ heading, children, successRef, reference }: { heading: string; children: ReactNode; successRef: React.RefObject<HTMLHeadingElement | null>; reference: string }) {
  return (
    <div className="form-success" role="status">
      <h2 ref={successRef} tabIndex={-1}>
        {heading}
      </h2>
      {children}
      {reference ? <p className="form-success__ref">Reference: {reference}</p> : null}
    </div>
  );
}
