"use client";

import { CONTACT_PREFERENCES, LIMITS, SERVICE_OPTIONS, contactForm, contactSteps } from "@/lib/forms/schema";
import { BRAND } from "@/lib/site";
import { CheckboxGroup, ErrorSummary, Honeypot, SubmitRow, SuccessPanel, TextField } from "./Fields";
import { NoScriptSteps, StepNav, StepPanel, StepReview, Stepper } from "./Steps";
import { useEnquiryForm } from "./useEnquiryForm";

const ids: Record<string, string> = {
  name: "contact-name",
  email: "contact-email",
  phone: "contact-phone",
  contactPreference: "contact-preference",
  enquiryTypes: "contact-enquiry-types",
  subject: "contact-subject",
  message: "contact-message",
};

export function ContactForm() {
  const { formRef, summaryRef, successRef, status, errors: e, message, reference, onSubmit, onKeyDown, step, last, next, back, goTo, review, headingRef } =
    useEnquiryForm(contactForm, "/api/contact/", contactSteps);
  const steps = contactSteps;

  if (status === "success") {
    return (
      <SuccessPanel heading="Message sent" successRef={successRef} reference={reference}>
        <p>Thank you. We’ve received your message and will respond using the preference you chose.</p>
        <p>
          If your request is urgent, call <a href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a>.
        </p>
      </SuccessPanel>
    );
  }

  const panel = { formId: "contact", steps, current: step };
  return (
    <form
      ref={formRef}
      action="/api/contact/"
      method="post"
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      className="enquiry-form enquiry-form--steps"
      aria-describedby="contact-form-note"
    >
      <NoScriptSteps />
      <Stepper formId="contact" steps={steps} current={step} onGo={goTo} />
      <p id="contact-form-note" className="form-note">
        Fields marked (required) must be completed.
      </p>
      <ErrorSummary def={contactForm} status={status} errors={e} message={message} summaryRef={summaryRef} fieldIds={ids} />

      <StepPanel {...panel} index={0} headingRef={headingRef(0)}>
        <div className="form-grid">
          <TextField id={ids.name} name="name" label="Your name" required autoComplete="name" maxLength={LIMITS.name} error={e.name} />
          <TextField id={ids.email} name="email" label="Your email" type="email" required autoComplete="email" maxLength={LIMITS.email} error={e.email} />
          <TextField id={ids.phone} name="phone" label="Your phone number" type="tel" autoComplete="tel" maxLength={LIMITS.phone} error={e.phone} />
        </div>
        <StepNav index={0} onBack={back} onNext={next} nextLabel={steps[1].title} />
      </StepPanel>

      <StepPanel {...panel} index={1} headingRef={headingRef(1)}>
        <CheckboxGroup id={ids.enquiryTypes} name="enquiryTypes" legend="Is your query regarding any of the following?" options={SERVICE_OPTIONS} columns error={e.enquiryTypes} />
        <TextField id={ids.subject} name="subject" label="Subject" maxLength={LIMITS.subject} error={e.subject} />
        <TextField id={ids.message} name="message" label="Your message" multiline maxLength={LIMITS.message} error={e.message} />
        <CheckboxGroup
          id={ids.contactPreference}
          name="contactPreference"
          legend="Preference"
          hint="How would you like us to respond? Choose one or more."
          options={CONTACT_PREFERENCES}
          required
          error={e.contactPreference}
        />
        {step === last ? <StepReview formId="contact" def={contactForm} steps={steps} values={review} onEdit={goTo} /> : null}
        <Honeypot />
        <div className="step-nav step-nav--final">
          <button type="button" className="button button--quiet step-nav__back" onClick={back}>
            Back
          </button>
          <SubmitRow status={status} label="Send message" />
        </div>
      </StepPanel>
    </form>
  );
}
