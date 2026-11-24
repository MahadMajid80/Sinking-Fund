"use client";

import { useState, useSyncExternalStore } from "react";
import { LIMITS, QUOTE_PREFERENCES, SERVICE_OPTIONS, quoteForm, quoteSteps, type ServiceValue } from "@/lib/forms/schema";
import { BRAND } from "@/lib/site";
import { CheckboxGroup, ErrorSummary, Honeypot, SubmitRow, SuccessPanel, TextField } from "./Fields";
import { Recaptcha } from "./Recaptcha";
import { NoScriptSteps, StepNav, StepPanel, StepReview, Stepper } from "./Steps";
import { useEnquiryForm } from "./useEnquiryForm";

const ids: Record<string, string> = {
  services: "quote-services",
  strataPlanNumber: "quote-strata-plan",
  numberOfLots: "quote-lots",
  siteAddress: "quote-site-address",
  managerName: "quote-manager-name",
  managerCompany: "quote-manager-company",
  managerPhone: "quote-manager-phone",
  managerEmail: "quote-manager-email",
  managerAddress: "quote-manager-address",
  siteContactName: "quote-site-contact-name",
  siteContactPhone: "quote-site-contact-phone",
  siteContactMobile: "quote-site-contact-mobile",
  siteContactAddress: "quote-site-contact-address",
  specialInstructions: "quote-instructions",
  replyPreference: "quote-preference",
};

const noopSubscribe = () => () => {};
const allowed = new Set<string>(SERVICE_OPTIONS.map((o) => o.value));

export function QuoteForm() {
  const { formRef, summaryRef, successRef, status, errors: e, message, reference, onSubmit, onKeyDown, step, last, next, back, goTo, review, headingRef, captchaWidget, captchaError, clearCaptchaError } =
    useEnquiryForm(quoteForm, "/api/quote/", quoteSteps);
  const steps = quoteSteps;
  // Preselect a service from ?service= (validated against the allow-list). Read on the client
  // so the page stays statically generated; the server snapshot is empty, so hydration is stable.
  const search = useSyncExternalStore(noopSubscribe, () => window.location.search, () => "");
  const param = new URLSearchParams(search).get("service");
  const preselectValue = param && allowed.has(param) ? param : null;
  const preselected = preselectValue ? SERVICE_OPTIONS.find((o) => o.value === (preselectValue as ServiceValue))!.label : null;
  const [edited, setEdited] = useState<string[] | null>(null);
  const services = edited ?? (preselectValue ? [preselectValue] : []);

  if (status === "success") {
    return (
      <SuccessPanel heading="Quote Request Sent" successRef={successRef} reference={reference}>
        <p>Thank you. We’ve received your quote request and will reply using the preference you chose.</p>
        <p>
          If your request is urgent, call <a href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a>.
        </p>
      </SuccessPanel>
    );
  }

  const panel = { formId: "quote", steps, current: step };
  return (
    <form
      ref={formRef}
      action="/api/quote/"
      method="post"
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      className="enquiry-form enquiry-form--steps"
      aria-describedby="quote-form-note"
    >
      <NoScriptSteps />
      <Stepper formId="quote" steps={steps} current={step} onGo={goTo} />
      <p id="quote-form-note" className="form-note">
        Fields marked (Required) must be completed.
      </p>
      <ErrorSummary def={quoteForm} status={status} errors={e} message={message} summaryRef={summaryRef} fieldIds={ids} />

      <StepPanel {...panel} index={0} headingRef={headingRef(0)}>
        <CheckboxGroup
          id={ids.services}
          name="services"
          legend="Services Required"
          hint={preselected ? <p>{preselected} is selected. You can change or add services.</p> : <p>Select every service you’d like quoted.</p>}
          options={SERVICE_OPTIONS}
          required
          columns
          error={e.services}
          values={services}
          onChange={setEdited}
        />
        <fieldset className="form-section">
          <legend>Job Details</legend>
          <div className="form-grid">
            <TextField id={ids.strataPlanNumber} name="strataPlanNumber" label="Strata Plan Number" maxLength={LIMITS.strataPlan} error={e.strataPlanNumber} />
            <TextField id={ids.numberOfLots} name="numberOfLots" label="Number of Lots" inputMode="numeric" maxLength={LIMITS.lots} error={e.numberOfLots} />
          </div>
          <TextField id={ids.siteAddress} name="siteAddress" label="Site Address" autoComplete="off" maxLength={LIMITS.address} error={e.siteAddress} />
        </fieldset>
        <fieldset className="form-section">
          <legend>Site Access Contact</legend>
          <p className="form-section__hint">The person who can give our valuer access to the property.</p>
          <div className="form-grid">
            <TextField id={ids.siteContactName} name="siteContactName" label="Name" required autoComplete="off" maxLength={LIMITS.name} error={e.siteContactName} />
            <TextField id={ids.siteContactPhone} name="siteContactPhone" label="Phone Number" type="tel" autoComplete="off" maxLength={LIMITS.phone} error={e.siteContactPhone} />
            <TextField id={ids.siteContactMobile} name="siteContactMobile" label="Mobile Number" type="tel" autoComplete="off" maxLength={LIMITS.phone} error={e.siteContactMobile} />
          </div>
          <TextField id={ids.siteContactAddress} name="siteContactAddress" label="Address" required autoComplete="off" maxLength={LIMITS.address} error={e.siteContactAddress} />
        </fieldset>
        <StepNav index={0} onBack={back} onNext={next} nextLabel={steps[1].title} />
      </StepPanel>

      <StepPanel {...panel} index={1} headingRef={headingRef(1)}>
        <div className="form-grid">
          <TextField id={ids.managerName} name="managerName" label="Strata Manager Name" required autoComplete="name" maxLength={LIMITS.name} error={e.managerName} />
          <TextField id={ids.managerCompany} name="managerCompany" label="Company" required autoComplete="organization" maxLength={LIMITS.company} error={e.managerCompany} />
          <TextField id={ids.managerPhone} name="managerPhone" label="Phone Number" type="tel" autoComplete="tel" maxLength={LIMITS.phone} error={e.managerPhone} />
          <TextField id={ids.managerEmail} name="managerEmail" label="Email" type="email" required autoComplete="email" maxLength={LIMITS.email} error={e.managerEmail} />
        </div>
        <TextField id={ids.managerAddress} name="managerAddress" label="Address" required autoComplete="street-address" maxLength={LIMITS.address} error={e.managerAddress} />
        <TextField id={ids.specialInstructions} name="specialInstructions" label="Special Instructions" multiline rows={5} maxLength={LIMITS.instructions} error={e.specialInstructions} />
        <CheckboxGroup id={ids.replyPreference} name="replyPreference" legend="Preference" hint="How would you like us to reply?" options={QUOTE_PREFERENCES} error={e.replyPreference} />
        {step === last ? <StepReview formId="quote" def={quoteForm} steps={steps} values={review} onEdit={goTo} /> : null}
        <Honeypot />
        {step === last ? <Recaptcha id="quote-captcha" widgetRef={captchaWidget} error={captchaError} onChange={clearCaptchaError} /> : null}
        <div className="step-nav step-nav--final">
          <button type="button" className="button button--quiet step-nav__back" onClick={back}>
            Back
          </button>
          <SubmitRow status={status} label="Send Quote Request" />
        </div>
      </StepPanel>
    </form>
  );
}
