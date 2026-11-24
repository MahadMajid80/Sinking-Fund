"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  HONEYPOT_FIELD,
  errorsForStep,
  firstStepWithError,
  normalise,
  validate,
  type FieldErrors,
  type FormDefinition,
  type FormStep,
  type FormValues,
} from "@/lib/forms/schema";
import { recaptchaToken, resetRecaptcha } from "./Recaptcha";

export type Status = "idle" | "pending" | "invalid" | "success" | "failed" | "rate_limited";

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Client-side behaviour for a step-by-step enquiry form. The form also works without
 * JavaScript (every step shown, native POST to the same endpoint), so this hook only enhances it.
 *
 * - Continue checks only the current step's fields, using the server's own rules.
 * - Enter in a single-line field continues to the next step instead of submitting.
 * - Submitting checks everything; any error returns to the first step that has one.
 * - Focus moves to the new step's heading, or to the error summary when there are errors.
 */
export function useEnquiryForm(def: FormDefinition, endpoint: string, steps: FormStep[]) {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const submissionId = useRef<string>("");
  const startedAt = useRef<number>(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [step, setStep] = useState(0);
  const [review, setReview] = useState<FormValues>({});
  /** reCAPTCHA widget on the last step (null until Google's script has drawn it). */
  const captchaWidget = useRef<number | null>(null);
  const [captchaError, setCaptchaError] = useState("");
  /** What to focus after the next render: bumped on every navigation or error. */
  const [focusRequest, setFocusRequest] = useState<{ target: "heading" | "summary"; n: number } | null>(null);
  const last = steps.length - 1;

  useEffect(() => {
    submissionId.current = newId();
    startedAt.current = Date.now();
    // JavaScript is available: switch from native browser validation to our accessible messages.
    if (formRef.current) formRef.current.noValidate = true;
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (!focusRequest) return;
    if (focusRequest.target === "summary") summaryRef.current?.focus();
    else {
      // Bring the top of the form (progress bar and step title) into view, then focus the title.
      const heading = headingRefs.current[step];
      const form = formRef.current;
      if (form && form.getBoundingClientRect().top < 0) {
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        form.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
      }
      heading?.focus({ preventScroll: true });
    }
  }, [focusRequest, step]);

  const requestFocus = (target: "heading" | "summary") => setFocusRequest((r) => ({ target, n: (r?.n ?? 0) + 1 }));

  function collect(): Record<string, unknown> {
    const fd = new FormData(formRef.current!);
    const data: Record<string, unknown> = {};
    for (const key of def.order) {
      data[key] = def.fields[key].kind === "multi" ? fd.getAll(key).map(String) : String(fd.get(key) ?? "");
    }
    data[HONEYPOT_FIELD] = String(fd.get(HONEYPOT_FIELD) ?? "");
    data.formStartedAt = startedAt.current;
    data.submissionId = submissionId.current;
    data["g-recaptcha-response"] = recaptchaToken(captchaWidget.current);
    return data;
  }

  function showStepErrors(index: number, all: FieldErrors) {
    setStep(index);
    setErrors(errorsForStep(steps[index], all));
    setMessage("");
    setStatus("invalid");
    requestFocus("summary");
  }

  function goTo(index: number) {
    if (index < 0 || index > last) return;
    if (index === last) setReview(collect() as FormValues);
    setErrors({});
    setMessage("");
    if (status !== "pending") setStatus("idle");
    setStep(index);
    requestFocus("heading");
  }

  function next() {
    const all = validate(def, normalise(def, collect()));
    const own = errorsForStep(steps[step], all);
    if (Object.keys(own).length) return showStepErrors(step, all);
    goTo(step + 1);
  }

  function back() {
    goTo(step - 1);
  }

  /** Enter in a single-line field moves on a step rather than submitting early. */
  function onKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    const t = e.target as HTMLElement;
    if (e.key !== "Enter" || step === last || t instanceof HTMLTextAreaElement || t instanceof HTMLButtonElement) return;
    if (t instanceof HTMLInputElement && t.type !== "checkbox" && t.type !== "radio") {
      e.preventDefault();
      next();
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "pending") return; // Duplicate submission guard (double click / Enter).
    if (step < last) return next();
    const data = collect();
    const clientErrors = validate(def, normalise(def, data));
    const errorStep = firstStepWithError(steps, clientErrors);
    if (errorStep >= 0) return showStepErrors(errorStep, clientErrors);
    // No client-side block on an unticked box: the server decides (it only requires the tick once
    // RECAPTCHA_CHECKBOX_SECRET_KEY is set), so a box Google cannot draw never stops a real enquiry.
    setCaptchaError("");
    setErrors({});
    setMessage("");
    setStatus("pending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: FieldErrors; message?: string; reference?: string; code?: string };
      if (res.ok && body.ok) {
        setReference(body.reference ?? "");
        setStatus("success");
        submissionId.current = newId();
        return;
      }
      if (res.status === 403 && body.code === "captcha_failed") {
        resetRecaptcha(captchaWidget.current);
        setStatus("idle");
        setCaptchaError(body.message ?? "Tick “I’m not a robot” again, then send.");
        document.getElementById(`${def.id}-captcha`)?.focus();
        return;
      }
      if (res.status === 400 && body.errors) {
        const serverStep = firstStepWithError(steps, body.errors);
        return showStepErrors(serverStep >= 0 ? serverStep : last, body.errors);
      }
      if (res.status === 409) {
        // Another request with this ID is already in flight; treat as pending.
        setStatus("pending");
        return;
      }
      setMessage(body.message ?? "Your message could not be sent.");
      setStatus(res.status === 429 ? "rate_limited" : "failed");
      requestFocus("summary");
    } catch {
      setMessage("Your message could not be sent because the connection failed. Check your connection and try again.");
      setStatus("failed");
      requestFocus("summary");
    }
  }

  const headingRef = (index: number) => (el: HTMLHeadingElement | null) => {
    headingRefs.current[index] = el;
  };

  const clearCaptchaError = () => setCaptchaError("");

  return { formRef, summaryRef, successRef, status, errors, message, reference, onSubmit, onKeyDown, step, last, next, back, goTo, review, headingRef, captchaWidget, captchaError, clearCaptchaError };
}
