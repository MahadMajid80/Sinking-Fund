"use client";

import type { ReactNode, RefObject } from "react";
import { displayValue, type FormDefinition, type FormStep, type FormValues } from "@/lib/forms/schema";

/**
 * Progress through the form. Completed steps are buttons, so people can go back to change
 * them; later steps can only be reached with Continue, which checks the current step first.
 */
export function Stepper({ formId, steps, current, onGo }: { formId: string; steps: FormStep[]; current: number; onGo: (index: number) => void }) {
  const progress = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 100;
  return (
    <nav className="stepper" aria-label="Form progress">
      <ol className="stepper__list" style={{ "--progress": `${progress}%` } as React.CSSProperties}>
        {steps.map((s, i) => {
          const state = i < current ? "done" : i === current ? "current" : "todo";
          return (
            <li key={s.id} className="stepper__item" data-state={state} aria-current={i === current ? "step" : undefined}>
              {i < current ? (
                <button type="button" className="stepper__button" onClick={() => onGo(i)} aria-describedby={`${formId}-step-${i}-done`}>
                  <span className="stepper__dot" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                    </svg>
                  </span>
                  <span className="stepper__label">{s.title}</span>
                  <span id={`${formId}-step-${i}-done`} className="visually-hidden">
                    (completed, select to change)
                  </span>
                </button>
              ) : (
                <span className="stepper__button">
                  <span className="stepper__dot" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="stepper__label">{s.title}</span>
                  {i > current ? <span className="visually-hidden">(not started)</span> : null}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** One step of fields. Inactive steps are hidden; their inputs still submit (no-JS posts every step). */
export function StepPanel({
  formId,
  steps,
  index,
  current,
  headingRef,
  children,
}: {
  formId: string;
  steps: FormStep[];
  index: number;
  current: number;
  headingRef: (el: HTMLHeadingElement | null) => void;
  children: ReactNode;
}) {
  const step = steps[index];
  const headingId = `${formId}-step-${step.id}`;
  return (
    <section className="form-step" data-step={step.id} hidden={index !== current} aria-labelledby={headingId}>
      <div className="form-step__head">
        <p className="form-step__count">
          Step {index + 1} of {steps.length}
        </p>
        <h2 id={headingId} className="form-step__title" tabIndex={-1} ref={headingRef}>
          {step.title}
        </h2>
        <p className="form-step__intro">{step.intro}</p>
      </div>
      {children}
    </section>
  );
}

/** Back / Continue for every step except the last (the last step has the submit row). */
export function StepNav({ index, onBack, onNext, nextLabel }: { index: number; onBack: () => void; onNext: () => void; nextLabel: string }) {
  return (
    <div className="step-nav">
      {index > 0 ? (
        <button type="button" className="button button--quiet step-nav__back" onClick={onBack}>
          Back
        </button>
      ) : null}
      <button type="button" className="button button--primary step-nav__next" onClick={onNext}>
        <span>
          Continue<span className="step-nav__to"> to {nextLabel}</span>
        </span>
      </button>
    </div>
  );
}

/** Review of everything entered so far, shown on the last step, with a Change button per step. */
export function StepReview({
  formId,
  def,
  steps,
  values,
  onEdit,
}: {
  formId: string;
  def: FormDefinition;
  steps: FormStep[];
  values: FormValues;
  onEdit: (index: number) => void;
}) {
  const earlier = steps.slice(0, -1);
  return (
    <section className="step-review" aria-labelledby={`${formId}-review-title`}>
      <h3 id={`${formId}-review-title`} className="step-review__title">
        Check your details
      </h3>
      {earlier.map((s, i) => (
        <div key={s.id} className="step-review__group">
          <div className="step-review__head">
            <h4>{s.title}</h4>
            <button type="button" className="step-review__edit" onClick={() => onEdit(i)}>
              Change<span className="visually-hidden"> {s.title.toLowerCase()}</span>
            </button>
          </div>
          <dl>
            {s.fields.map((f) => {
              const v = displayValue(def, f, values[f]);
              return (
                <div key={f} className="step-review__row">
                  <dt>{def.fields[f].label}</dt>
                  <dd data-empty={v ? undefined : ""}>{v || "Not provided"}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}
    </section>
  );
}

/** Without JavaScript every step is shown and the step controls are hidden. */
export function NoScriptSteps() {
  return (
    <noscript>
      <style>{`.form-step[hidden]{display:block!important}.stepper,.step-nav__back,.step-nav__next,.step-review{display:none!important}`}</style>
    </noscript>
  );
}

export type HeadingRefs = RefObject<(HTMLHeadingElement | null)[]>;
