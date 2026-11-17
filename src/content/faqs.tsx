import type { ReactNode } from "react";
import type { ServiceKey } from "@/lib/site";

/**
 * FAQ content transcribed verbatim from the export's accordion markup
 * (building-insurance-valuation, sinking-fund-plans, work-health-and-safety, asbestos-reports).
 * Six questions per service, 24 in total. Answers are rendered in the initial HTML inside
 * native <details> elements. Typos are preserved; corrections are proposed in docs/review-log.md.
 */

export interface Faq {
  id: string;
  question: string;
  answer: ReactNode;
}

export interface FaqPage {
  service: ServiceKey;
  title: string;
  intro: string;
  faqs: Faq[];
}

export const faqPages: Record<ServiceKey, FaqPage> = {
  biv: {
    service: "biv",
    title: "Building Insurance Valuation FAQs",
    intro: "Six common questions about building insurance valuations for strata schemes, community schemes and stand alone properties.",
    faqs: [
      {
        id: "what-is-a-building-insurance-valuation",
        question: "What is a Building Insurance Valuation?",
        answer: (
          <>
            <p>
              A Building Insurance Valuation is a professional assessment carried out by a Registered Valuer of the replacement cost of all improvements within a strata
              scheme, community scheme or stand alone property.
            </p>
            <p>
              The Building Insurance Valuation also allows for the escalation of construction costs over the period of insurance, and the periods for documentation, and
              construction of the replacement building, an allowance for professional fees, demolition and removal of debris, gst, amongst other things.
            </p>
          </>
        ),
      },
      {
        id: "do-the-owners-need-one",
        question: "Do the owners need to get a Building Insurance Valuation?",
        answer: <p>Yes. There is legislation requiring strata properties to obtain a Building Insurance Valuation.</p>,
      },
      {
        id: "what-is-the-benefit",
        question: "What is the benefit of obtaining a Building Insurance Valuations?",
        answer: (
          <>
            <p>
              The benefit of obtaining a Building Insurance Valuation regularly is to ensure that the sum insured is in line with the real cost of replacing the
              improvements in the case of total destruction or partial damage.
            </p>
            <p>
              We recommend that an annual valuation be carried out, rather than the Owners Corporation or Property Owner simply accepting some arbitrary escalation well
              above the actual rise in construction costs.
            </p>
          </>
        ),
      },
      {
        id: "does-it-increase-costs",
        question: "Does a Building Insurance Valuation increase the amount that owners have to pay on an annual basis?",
        answer: (
          <p>
            No. In fact, by obtaining a current Building Insurance Valuation the Owners Corporation and Property Owner would rest assured knowing that they are paying the
            appropriate premium based upon an accurate and current recommended sum insured.
          </p>
        ),
      },
      {
        id: "can-owners-vary",
        question: "Can Owners vary a Building Insurance Valution?",
        answer: (
          <p>
            The Owners Corporation must insure the building for &apos;at least&apos; the recommended sum insured from the latest Building Insurance Valuation. If the
            Owners Corporation or Property Owner and the Insurer agree, the property can be insured for an amount higher than the recommended sum insured obtained from the
            last Building Insurance Valuation.
          </p>
        ),
      },
      {
        id: "how-often-reviewed",
        question: "How often should a Building Insurance Valuation be reviewed?",
        answer: (
          <>
            <p>It depends on the type of property. In our opinion the following is a reasonable guide to a minimum frequency for obtaining revaluations.</p>
            <div className="table-scroll" role="region" aria-labelledby="revaluation-caption" tabIndex={0}>
              <table className="data-table data-table--compact">
                <caption id="revaluation-caption">Suggested minimum revaluation frequency</caption>
                <thead>
                  <tr>
                    <th scope="col">Property type</th>
                    <th scope="col">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Lot 1 in most Community Schemes</th>
                    <td>
                      <em>Each 5 years</em>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">if Lot 1 includes major improvements sheds, cabana, pool, recreation hall, community hall, bbq areas, then</th>
                    <td>
                      <em>Each 2-3 years</em>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Three level walk up (12 and 18 packs)</th>
                    <td>
                      <em>Each 2-3 years</em>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Villas, townhouses and the like</th>
                    <td>
                      <em>Each 2-3 years</em>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Six level and more schemes (residential or other)</th>
                    <td>
                      <em>Each year</em>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Industrial office warehouses - old</th>
                    <td>
                      <em>Each 1-2 years</em>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Industrial office warehouses - new</th>
                    <td>
                      <em>Each 2-3 years</em>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Commercial office buildings - large</th>
                    <td>
                      <em>Each 1-2 years</em>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Commercial office buildings - small</th>
                    <td>
                      <em>Each 2-3 years</em>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ),
      },
    ],
  },

  sfp: {
    service: "sfp",
    title: "Capital Works or Sinking Fund Plan FAQs",
    intro: "Six common questions about capital works and sinking fund plans for owners corporations.",
    faqs: [
      {
        id: "what-is-a-plan",
        question: "What is a Capital Works or Sinking Fund Plan?",
        answer: (
          <p>
            A plan as to how the owners of a strata plan will repair and maintain common property and raise sufficient funds to cover the costs. The annual amounts
            required for the 10-year plan will vary between schemes, for instance, newer schemes may require relatively less money than the plans for older schemes with
            more repair work due.
          </p>
        ),
      },
      {
        id: "do-the-owners-need-one",
        question: "Do the owners need to get a Capital Works or Sinking Fund Plan?",
        answer: (
          <p>
            Yes, there is requisite legislation in NSW, the ACT and Victoria to obtain a Sinking Fund Plan. For example, from July 2009, all strata schemes in NSW are
            required by law to have a 10-year sinking fund plan in place as defined in the Strata Schemes Management Act 1996. The 10-year plan must be approved by owners
            at an Annual General Meeting (AGM) and must be reviewed and adjusted, if required, each five years.
          </p>
        ),
      },
      {
        id: "what-is-the-benefit",
        question: "What is the benefit of obtaining a Capital Works or Sinking Fund Plan?",
        answer: (
          <>
            <p>
              A good plan should increase the value of your property by ensuring it presents well and is well maintained. Our Australian designed and owned software
              provides flexibility in our sinking fund recommendations to ensure that you
            </p>
            <ul>
              <li>Do not have excessive funds sitting around in the bank</li>
              <li>Have minimal but sufficient annual Sinking Fund contributions (no special levies)</li>
              <li>The owners do not have to pay levies larger than are required</li>
            </ul>
          </>
        ),
      },
      {
        id: "does-it-increase-costs",
        question: "Does a Capital Works or Sinking Fund Plan increase the amount that owners have to pay on an annual basis?",
        answer: (
          <p>
            This is not a black and white answer; each sinking fund plan should reflect the individual needs of its scheme. On some occasions we have recommended a
            reduction in the amount being collected due to unnecessary money sitting idle in the Sinking Fund account. An increase may be recommended if the current
            amount being collected is insufficient to address the projected cost requirements of repairing, maintaining or renewing the improvements and its surrounds.
          </p>
        ),
      },
      {
        id: "can-owners-vary",
        question: "Can Owners vary a Capital Works or Sinking Fund Plan?",
        answer: <p>Yes, it is their fund to use as they need, providing they meet their strict obligations to repair and maintain the common property.</p>,
      },
      {
        id: "how-often-reviewed",
        question: "How often should a Capital Works or Sinking Fund Plan be reviewed?",
        answer: <p>We recommend a Sinking Fund Plan be prepared every 2-3 years.</p>,
      },
    ],
  },

  whs: {
    service: "whs",
    title: "Work Health and Safety FAQs",
    intro: "Six common questions about work health and safety inspections and safety reports for owners corporations and property owners.",
    faqs: [
      {
        id: "what-is-an-inspection",
        question: "What is a Work, Health and Safety Inspection?",
        answer: (
          <>
            <p>
              Primarily a Work, Health and Safety inspection identifies any risk of harm to people or potential damage to property from both a Common Law Duty of Care
              and a legislative requirement.
            </p>
            <p>
              In essence, a property has to be without risks to the health and safety of any person. Our Work, Health and Safety Inspections take a practical and
              sensible approach to dealing with and treating any hazards and any likely risks associated with those hazards.
            </p>
            <p>It is NOT a current standards compliance report where every structure and item has to be brought up to the current Building standards.</p>
          </>
        ),
      },
      {
        id: "do-the-owners-need-one",
        question: "Do the owners need to get a Work, Health and Safety Inspection?",
        answer: (
          <>
            <p>
              There are some exemptions for a purely residential strata scheme from being classified as a Person Conducting a Business or Undertaking (PCBU) and thereby
              not having to comply with the Work Health and Safety Legislation, unless they engage a worker as an Employee.
            </p>
            <p>
              HOWEVER, an Owners Corporation or Property Owner still has a Common Duty of Care to ensure that their property is without risks to the health and safety of
              any person. This duty is codified under Civil Liability legislation (Civil Liability Act 2002 (NSW), the Wrongs Act 1958 (Victoria), or the Civil Law
              (Wrongs) Act 2002 (ACT)).
            </p>
            <p>
              It is absolutely prudent to obtain a professional Safety Report from BIV Reports Pty Limited to be able to demonstrate to a Court that you have taken
              reasonable steps and proper care in the management and ownership of your property.
            </p>
          </>
        ),
      },
      {
        id: "what-is-the-benefit",
        question: "What is the benefit of obtaining a Work, Health and Safety Inspection?",
        answer: (
          <>
            <p>
              The benefit of obtaining a professional Safety Report from BIV Reports Pty Limited is to identify and then fix any likely hazards so that your property is
              safe for you, your children and extended family and your visitors.
            </p>
            <p>
              In addition you are significantly minimising any legal issue when you can demonstrate to a Court that you have taken reasonable steps and proper care in
              the management and ownership of your property.
            </p>
          </>
        ),
      },
      {
        id: "does-it-increase-costs",
        question: "Does a Work, Health and Safety Inspection increase the amount that owners have to pay on an annual basis?",
        answer: (
          <>
            <p>In some cases where the property has significant hazards that need to be addressed, the answer is yes.</p>
            <p>
              Proper management and care of a property would ordinarily include the rectification and minimisation of the risk of harm. It is usually where a maintenance
              program has been neglected that issues of risk of harm arise, and consequential costs arise.
            </p>
          </>
        ),
      },
      {
        id: "can-owners-vary",
        question: "Can Owners vary a Work, Health and Safety Report?",
        answer: (
          <p>
            A Safety Report can be varied by an owner dealing with the likely control measures that are recommended within a report. For example, a recommendation may
            include the grinding down of an exposed trip hazard in an access way, however an owner may decide that it is &apos;reasonably practicable&apos; to simply
            choose to secure that area from anyone being able to enter, or apply highlight paint to the hazard and warning signage. That is, a different control measure
            may be implemented to the recommended control measures, and the identified hazard has to be addressed.
          </p>
        ),
      },
      {
        id: "how-often-reviewed",
        question: "How often should a Work, Health and Safety Inspection be reviewed?",
        answer: (
          <p>
            It depends on the property, but a prudent approach is obtaining an annual re-inspection by BIV Reports Pty Limited. For example, a modern small villa complex
            with limited common property may be best served with a two to three yearly re-inspection cycle, whereas a commercial or retail property with a large number
            of transient people may require a six monthly or annual re-inspection.
          </p>
        ),
      },
    ],
  },

  asb: {
    service: "asb",
    title: "Asbestos Report FAQs",
    intro: "Six common questions about Asbestos Reports, which include both an Asbestos Register and an Asbestos Management Plan.",
    faqs: [
      {
        id: "what-is-an-asbestos-report",
        question: "What is an Asbestos Report?",
        answer: (
          <>
            <p>An Asbestos Report is a term developed by BIV Reports Pty limited and includes BOTH an Asbestos Register and an Asbestos Management Plan.</p>
            <p>The Asbestos Register is a legislative requirement generally found in Work, Health and Safety legislation, and relates to a work place.</p>
            <p>An Asbestos Management Plan sets out the control measures and time frames to address any identified Asbestos or Asbestos Containing Material (ACM).</p>
          </>
        ),
      },
      {
        id: "do-the-owners-need-one",
        question: "Do the owners need to get an Asbestos Report?",
        answer: (
          <>
            <p>
              There are specific exemptions from the Work, Health and Safety legislation for residential strata schemes of having to obtain an Asbestos Register and an
              Asbestos Management Plan, particularly where the strata scheme does not engage any worker as an employee.
            </p>
            <p>
              However, none of these exemptions protect the owner from legal action from a breach of their Common Law Duty of Care. Asbestos is a known dangerous material
              and as such, each owner has a Duty of Care to ensure that no harm comes to anyone as a result of the asbestos on that property.
            </p>
            <p>
              A prudent owner should simply obtain an Asbestos Report from BIV Reports Pty Limited for the small fee that we charge. For example, a 6 lot strata scheme
              would be around $352 including gst, a 12 lot strata scheme would be $451 including gst and a large investment cottage would be $440 including gst, AND
              remember that you get BOTH an Asbestos Register and an Asbestos Management Plan for the one low all-inclusive price.
            </p>
          </>
        ),
      },
      {
        id: "what-is-the-benefit",
        question: "What is the benefit obtaining an Asbestos Report?",
        answer: (
          <>
            <p>
              The benefit of obtaining an Asbestos Report from BIV Reports Pty Limited (which includes BOTH an Asbestos Register and an Asbestos Management Plan) is that
              you would be complying with legislation where required, and from a Common Law Duty of Care point of view you would be discharging one of the key onuses of a
              responsible property owner, and that is identifying hazards.
            </p>
            <p>Asbestos is a known hazardous material which can cause harm to people.</p>
            <p>
              Obtaining an Asbestos Report (including BOTH an Asbestos Register and an Asbestos Management Plan) is an inexpensive exercise and of significant benefit to
              all owner.
            </p>
            <p>Without an Asbestos Register a contractor is at risk and so is the instructing property owner or their agent, particularly if an asbestos contamination incident occurs.</p>
            <p>
              When contractors are engaged to work on a property, they also have the benefit of knowing what items are asbestos or likely to contain asbestos, and the
              contractor can then take appropriate measures such as wearing a mask, goggles, protective clothing, and then sealing the area, collecting any dust properly,
              and correctly disposing of any hazardous material.
            </p>
          </>
        ),
      },
      {
        id: "does-it-increase-costs",
        question: "Does an Asbestos Report increase the amount that owners have to pay on an annual basis?",
        answer: (
          <>
            <p>
              No. If anything, obtaining an Asbestos Report from BIV Reports Pty Limited (which includes BOTH an Asbestos Register and an Asbestos Management Plan) saves
              money.
            </p>
            <p>
              Under Work Health and Safety legislation a workplace must have an Asbestos Register and there are significant fines if an Asbestos Register in not in place
              ($18,000 fine for a body corporate).
            </p>
            <p>
              If multiple contractors had to attend a property for work, each would be obligated to obtain an Asbestos Register. It would be more prudent for a property
              owner to simply obtain one Asbestos Register, rather than pay for multiple Asbestos Registers through each contractor&apos;s quote.
            </p>
          </>
        ),
      },
      {
        id: "can-owners-vary",
        question: "Can Owners vary an Asbestos Report?",
        answer: (
          <>
            <p>
              Generally an Owner cannot arbitrarily vary an Asbestos Register. If an item was assumed to contain asbestos (which is permitted under Clause 422 of the Work
              Health and Safety Regulation 2011 in NSW and the ACT), the Register can be varied if a sample is taken of that item and analysed by a NATA Accredited Lab and
              found not to contain asbestos. Then the notation on that item in the Register can be varied in accordance with the NATA lab analysis which should then be
              attached to the register.
            </p>
            <p>
              An Asbestos Management Plan can be varied by an owner provided that appropriate measures are taken. That is, an Asbestos Management Plan deals with the
              rectification, removal or other works to eliminate, mitigate or minimise harm caused by asbestos on the subject property, and includes who is responsible for
              that work and when that work must be undertaken by.
            </p>
          </>
        ),
      },
      {
        id: "how-often-reviewed",
        question: "How often should an Asbestos Report be reviewed?",
        answer: (
          <p>An Asbestos Report should be reviewed annually to ensure that no damage to an item containing asbestos, or assumed to contain asbestos has occurred.</p>
        ),
      },
    ],
  },
};
