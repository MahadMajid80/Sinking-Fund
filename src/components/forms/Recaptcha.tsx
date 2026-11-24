"use client";

import { useEffect, useRef } from "react";

/** Public site key (safe to publish). The secret key lives only in the hosting environment. */
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LcufjAuAAAAAIVAEpiusz4KimiGlIvQ64mMCaCW";

type Grecaptcha = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => number;
  reset: (id?: number) => void;
  getResponse: (id?: number) => string;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    __sfRecaptchaReady?: () => void;
  }
}

let loading: Promise<void> | null = null;

/** Loads Google's script once, only when a form reaches its last step (keeps every page fast). */
function loadRecaptcha(): Promise<void> {
  if (window.grecaptcha?.render) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    window.__sfRecaptchaReady = () => resolve();
    const s = document.createElement("script");
    s.src = "https://www.google.com/recaptcha/api.js?onload=__sfRecaptchaReady&render=explicit&hl=en-GB";
    s.async = true;
    s.defer = true;
    s.onerror = () => {
      loading = null;
      reject(new Error("reCAPTCHA failed to load"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

export const recaptchaToken = (widget: number | null) => {
  if (widget === null || !window.grecaptcha) return "";
  try {
    return window.grecaptcha.getResponse(widget);
  } catch {
    return "";
  }
};

export const resetRecaptcha = (widget: number | null) => {
  if (widget === null || !window.grecaptcha) return;
  try {
    window.grecaptcha.reset(widget);
  } catch {
    /* widget already gone */
  }
};

/** Google reCAPTCHA v2 checkbox. The token is added to the form as "g-recaptcha-response" by Google's script. */
export function Recaptcha({
  id,
  widgetRef,
  error,
  onChange,
}: {
  id: string;
  widgetRef: React.RefObject<number | null>;
  error?: string;
  onChange: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const changeRef = useRef(onChange);
  useEffect(() => {
    changeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;
    loadRecaptcha()
      .then(() => {
        if (cancelled || !box.current || !window.grecaptcha) return;
        widgetRef.current = window.grecaptcha.render(box.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: () => changeRef.current(),
          "expired-callback": () => changeRef.current(),
        });
      })
      .catch(() => {
        /* blocked or offline: the server decides; the phone number is shown if sending fails */
      });
    return () => {
      cancelled = true;
      widgetRef.current = null;
    };
  }, [widgetRef]);

  return (
    <div className="form-captcha" id={id} tabIndex={-1}>
      <div ref={box} />
      {error ? (
        <p className="field__error form-captcha__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
