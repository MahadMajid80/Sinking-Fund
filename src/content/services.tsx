import type { ReactNode } from "react";
import type { ServiceKey } from "@/lib/site";

/**
 * Service page content transcribed verbatim from the WordPress export
 * (services/{biv,sfp,whs,asb}/index.html). Headings were H2/H3 in the source and are
 * normalised to H2 under a single H1. Proposed factual or legal edits are NOT applied here;
 * they are listed in docs/review-log.md for owner approval.
 */

export interface ServiceSection {
  id: string;
  heading: string;
  body: ReactNode;
}

export interface ServiceContent {
  key: ServiceKey;
  /** H1, from the original page subheader. */
  title: string;
  /** Homepage card heading (original: BIV, WHS Reports, Sinking Fund Plans, Asbestos Reports). */
  cardTitle: string;
  /** Homepage card summary, verbatim. Also used as the page introduction. */
  summary: string;
  mark: string;
  /** Name of the diamond quadrant highlighted in the service mark. */
  quadrant: "top" | "left" | "right" | "bottom";
  sections: ServiceSection[];
}

const turnaround: ServiceSection = {
  id: "turnaround-and-fees",
  heading: "Turnaround Time and Fees",
  body: <p>Our normal turnaround time is around 3 to 7 business days, and we will beat any competitors written quote by 12%.</p>,
};

export const services: Record<ServiceKey, ServiceContent> = {
  biv: {
    key: "biv",
    title: "Building Insurance Valuation",
    cardTitle: "Building Insurance Valuation",
    summary:
      "We provide Certificates of Value for the replacement cost and reinstatement of the buildings of the Strata or Community Plan in order to comply with the relevant legislation.",
    mark: "/images/marks/biv.png",
    quadrant: "top",
    sections: [
      {
        id: "why-do-i-need-an-insurance-valuation",
        heading: "Why Do I Need an Insurance Valuation?",
        body: (
          <p>
            It is prudent for all Strata Schemes to obtain a property valuation by a ‘Qualified Valuer’ for building insurance purposes, at least every 5 years. Our
            recommendation is that a valuation be undertaken every two to three years (and in some cases every year for larger commercial and industrial properties) to
            ensure the insured value reflects true building replacement costs.
          </p>
        ),
      },
      {
        id: "building-insurance-valuations",
        heading: "Building Insurance Valuations",
        body: (
          <p>
            We provide Certificates of Value for the replacement cost and reinstatement of the buildings of the Strata or Community Plan in order to comply with the
            relevant legislation. For example, in NSW, Section 161 of the Strata Schemes Management Act 2015 and Clause 39 of the Strata Schemes Management Regulation
            2016.
          </p>
        ),
      },
      {
        id: "experience",
        heading: "Experience",
        body: (
          <>
            <p>
              Our chief valuer has over 30 years experience including Expert Evidence in numerous Courts and due diligence on the largest property transactions in
              Australia to the smaller suburban cottage, amongst other things.
            </p>
            <p>
              <strong>We recommend that a Registered Valuer carries out your Building Insurance Valuation.</strong>
            </p>
          </>
        ),
      },
      {
        id: "professional-indemnity-insurance",
        heading: "Professional Indemnity Insurance",
        body: (
          <p>
            We are members of a Cover of Excellence scheme under the Professional Standards Councils (NSW) and we carry $5,000,000 Professional Indemnity Insurance.
          </p>
        ),
      },
      {
        id: "re-valuation-frequency",
        heading: "Re-Valuation Frequency",
        body: (
          <>
            <p>
              Good strata and property managers recommend that a Building Insurance Valuation be obtained at least every 3 years and in some cases each year. This
              protects against potential loss from under-insurance. We consider that the best solution is to have an annual inspection by a Registered Valuer to ensure
              that your sum insured keeps up to date with the market changes in building costs.
            </p>
            <p>
              If you are under-insured the insurance company may use the “co-insurance” or averaging clause of the Policy and may only pay a portion of the true
              replacement cost of the improvements. The short fall may have to be paid by the owner or the Strata Manager if found to be negligent by not getting an
              updated and current Building Insurance Valuation.
            </p>
            <p>
              Be aware that building costs can increase significantly greater than CPI. For example, in 2004 concrete and steel costs rose by over 25%. There is a danger
              of simply applying a CPI or arbitrary increase without being familiar with the movement in construction costs. Use our service to determine an accurate and
              up to date Building Insurance Valuation for your sum insured and compliance with the legislation.
            </p>
          </>
        ),
      },
      {
        id: "ordering",
        heading: "Ordering a Building Insurance Valuation",
        body: (
          <>
            <p>When we receive your instructions we will:</p>
            <ul>
              <li>
                Inspect the subject property and assess the materials and the amount of materials required for the complete replacement of the building and its ancillary
                improvements.
                <br />
                take photos of the improvements and the surrounding area.
              </li>
              <li>
                Estimate the replacement cost the improvements and materials, and allow for any additional items specified in the relevant legislation or required by good
                valuation practice.
              </li>
              <li>Ensure that the Building Insurance Valuation will be carried out by a Registered Valuer without limitation.</li>
              <li>Provide Certificates of Value, (usually one bound copy, one unbound for photocopying as well as a pdf file for emailing).</li>
            </ul>
          </>
        ),
      },
      {
        id: "compliance",
        heading: "Compliance",
        body: (
          <>
            <p>
              Our Building Insurance Valuation Reports comply with the relevant legislation and good valuation practice as required by our professional Valuers Institute.
              Our Report details the individual components that correctly make up a valid Building Insurance Valuation such as demolition costs, professional and Council
              fees, escalation in constructions costs and gst, amongst other things.
            </p>
            <p>
              We also take into account different cost factors such as location (some country areas or in a less accessible area), different types of construction
              material, different finishes and the like.
            </p>
            <p>We are specialists in this type of valuation work. In 2014 we assessed in excess of $11 billion worth of property.</p>
          </>
        ),
      },
      {
        id: "further-services",
        heading: "Further Services",
        body: (
          <p>
            In addition to carrying out Building Insurance Valuations, we also assess and prepare Asbestos Registers and Asbestos Management Plans, Sinking Fund Plans,
            Reserve Fund Plans and Maintenance Fund Plans, Work Health and Safety Reports including &apos;Common Law Duty of Care&apos; Reports (WHS and OHS), Common
            Property Repair and Maintenance Reports.
          </p>
        ),
      },
      turnaround,
    ],
  },

  sfp: {
    key: "sfp",
    title: "Capital Works or Sinking Fund Plan",
    cardTitle: "Sinking Fund Plans",
    summary:
      "We specialise in and are passionate about providing 10 Year and 15 year Capital Works or Sinking Fund Plans and Maintenance Fund Plans which are compliant with s80 of the Strata Schemes Management Act.",
    mark: "/images/marks/sfp.png",
    quadrant: "right",
    sections: [
      {
        id: "why-do-i-need-a-plan",
        heading: "Why Do I Need a Capital Works or Sinking Fund Plan?",
        body: (
          <p>
            An Owners Corporation must prepare a 10 year Capital Works or Sinking Fund Plan (reviewed every 5 years) as required by the relevant legislation (in NSW
            under the Strata Schemes Management Act 2015, in ACT the Unit Titles (Management) Act 2011, or Maintenance Plans in Victoria under the Owners Corporation
            Act). This enables the ‘OC’ to plan for the cost of maintaining common property in their Strata Scheme by raising appropriate reserve funds to cover
            necessary expenditure.
          </p>
        ),
      },
      {
        id: "capital-works-or-sinking-fund-plans",
        heading: "Capital Works or Sinking Fund Plans",
        body: (
          <>
            <p>
              We specialise in and are passionate about providing 10 Year and 15 year Capital Works or Sinking Fund Plans and Maintenance Fund Plans which are compliant
              with s80 of the Strata Schemes Management Act 2015, s82 of the Unit Titles (Management) Act 2011, s36 of the Owners Corporations Act 2006.
            </p>
            <p>Our Capital Works or Sinking Fund Plans are practical and are set out in:</p>
            <ul>
              <li>Easy To Read Reports</li>
              <li>Owners Corporation obligations</li>
              <li>
                <strong>10 Year Capital Works or Sinking Fund Plans</strong> are required by legislation and are to be reviewed at least each five years.
              </li>
            </ul>
            <p>
              The purpose of a Capital Works or Sinking Fund Plan is to determine the amount to be set aside each year to meet expenses of a capital nature. These
              include the replacement, renewal, or repair of both minor and major capital items such as windows, fencing, concrete paths, painting of buildings, amongst
              many other things.
            </p>
            <p>
              The benefit of obtaining a Capital Works or Sinking Fund Plan is to provide for a pool of funds to be easily applied to maintain the appearance and the
              quality of the improvements contained within the strata scheme, and thereby assisting the Owners Corporation to meet their legal obligations.
            </p>
            <p>
              There is a strict Duty of Care to repair and maintain common property, and in particular to ensure that the common property is safe for owners and their
              visitors. (See s106 of the Strata Schemes Management Act 2015, s24 of the Unit Titles (Management) Act 2011, s46 of the Owners Corporations Act 2006.
            </p>
            <p>
              In addition, there is the Common Law Duty of Care to all visitors and owners to ensure that the property is safe for any person. These provisions are
              usually set out under the respective Civil Liability Act 2002 (NSW), the Wrongs Act 1958 (Victoria), or the Civil Law (Wrongs) Act 2002 (ACT).
            </p>
          </>
        ),
      },
      {
        id: "ordering",
        heading: "Ordering a Capital Works or Sinking Fund Plan",
        body: (
          <>
            <p>Once we receive an order for a Capital Works or Sinking Fund Plan we will</p>
            <ul>
              <li>inspect the subject property and identify likely items requiring repair, renewal, replacement or maintenance within and beyond 10 years.</li>
              <li>
                provide the Owners Corporation with the opportunity to include additional items that they would like. For example, earlier renewal of landscaping,
                upgrading of any other common areas such as building a BBQ area, or kids playground or gym.
              </li>
              <li>
                Analyse, prepare and issue the 10 year Capital Works or Sinking Fund Forecast with the recommended capital works or sinking fund amount to be set aside
                each year, the total amount to be expended throughout the 10 year term, including an allowance for the escalation of construction costs, and the likely
                timeframe for the maintenance or replacement of each item.
              </li>
              <li>take photos of relevant replacement or maintenance items.</li>
              <li>ensure that the 10 year Capital Works or Sinking Fund Forecast will be carried out by a Registered Valuer without limitation.</li>
            </ul>
          </>
        ),
      },
      {
        id: "nsw-strict-duty",
        heading: "NSW – Strict Duty to Repair and Maintain Common Property",
        body: (
          <>
            <p>For example, in NSW the current legislative framework requires compliance with</p>
            <ul>
              <li>
                Section 106 of the Strata Schemes Management Act 2015 require that an Owners Corporation <strong>must</strong> properly maintain and keep in a state of
                good and serviceable repair the common property and any personal property vested in the owners corporation.
              </li>
              <li>
                Section 80 of the Strata Schemes Management Act 2015 provides the mechanism by way of creating and maintaining a capital works or sinking fund to have
                sufficient funds available to meet the OC&apos;s obligations under s106.
              </li>
              <li>The plan is to be reviewed at least each 5 years and, if necessary, adjusted.</li>
            </ul>
          </>
        ),
      },
      {
        id: "reviews",
        heading: "Reviews - Best Approach",
        body: (
          <ul>
            <li>Recommend a review within 5 years from the date of the last plan, or the date of the required compliance</li>
            <li>Obtain a new report with a new site inspection</li>
            <li>Consider any variation to the existing annual sinking fund contributions</li>
            <li>It is similar to reviewing a budget to adjust and fine tune the savings for the Owners Corporation</li>
          </ul>
        ),
      },
      {
        id: "points-of-consideration",
        heading: "Points of Consideration",
        body: (
          <ul className="list-columns">
            <li>Independent unbiased advice</li>
            <li>Avoid unnecessary Special Levies</li>
            <li>User pays</li>
            <li>A fairer system</li>
            <li>Adds value - building well maintained and large Sinking Fund balance</li>
            <li>Legal requirement to maintain common property</li>
            <li>Good practice</li>
            <li>Saves owners and strata managers time</li>
            <li>Professionally carried out</li>
            <li>Risk Transfer - we have $5M Professional Indemnity insurance for the Sinking Fund Plan</li>
            <li>Addresses latent and unforseen costs</li>
          </ul>
        ),
      },
      {
        id: "goal",
        heading: "Goal of a Capital Works or Sinking Fund Plan",
        body: (
          <ul>
            <li>To simply determine the amount to be set aside each year</li>
          </ul>
        ),
      },
      {
        id: "what-a-plan-is-not",
        heading: "What a Capital Works or Sinking Fund Plan Is NOT",
        body: (
          <ul>
            <li>Not a detailed quote for every single item, for replacement, renewal or repair</li>
            <li>Not a highly accurate assessment for the cost and time frame</li>
            <li>Not a Dilapidation Report</li>
            <li>Not a Maintenance Schedule</li>
            <li>Not an opportunity for the owners to get free building, fire or safety advice</li>
          </ul>
        ),
      },
      {
        id: "final-points",
        heading: "Final Points to Consider",
        body: (
          <ul>
            <li>
              Legislation: <em className="emphasis-underline">strict duty</em> to repair and maintain common property
            </li>
            <li>Aging population on fixed incomes</li>
            <li>No ability to comply without adequate funds</li>
            <li>Potential increase in safety and litigation issues (and potentially no insurance)</li>
            <li>Resistance to set money aside may present a difficult management situation</li>
          </ul>
        ),
      },
      {
        id: "risk-management",
        heading: "Risk Management",
        body: (
          <p>
            Appropriate funding may prevent the owners from breaching their strict statutory obligation to repair and maintain common property, and prevent the owners
            from incurring unnecessary costs and penalties as occurred in ‘Seiwa Australia Pty limited v Owners SP35042 [2006] NSWSC 1157’ and ‘Nicita v Owners SP64837
            [2010] NSWSC 68’.
          </p>
        ),
      },
      {
        id: "further-services",
        heading: "Further Services",
        body: (
          <p>
            In addition to carrying out Capital Works Fund Plans or Sinking Fund Plans, Reserve Fund Plans and Maintenance Fund Plans, we also assess and prepare
            Asbestos Registers and Asbestos Management Plans, Work Health and Safety Reports including &apos;Common Law Duty of Care&apos; Reports (WH&amp;S and OH&amp;S),
            Building Insurance Valuations, and Common Property Repair and Maintenance Reports.
          </p>
        ),
      },
      turnaround,
    ],
  },

  whs: {
    key: "whs",
    title: "Work Health and Safety",
    cardTitle: "WHS Reports",
    summary:
      "We carry out Safety Reports to identify any risk of potential damage to property from both a Common Law Duty of Care and a WHS legislative requirement.",
    mark: "/images/marks/whs.png",
    quadrant: "left",
    sections: [
      {
        id: "do-i-need-a-safety-report",
        heading: "Do I Need a Safety Report?",
        body: (
          <p>
            As an Owners Corporation it is essential that you be aware of the likely hazards and associated risks you are obliged to control under your Common Law Duty
            of Care and the Work Health and Safety Act legislation if applicable in your State.
          </p>
        ),
      },
      {
        id: "whs-reports",
        heading: "WHS Reports - Safety Reports (Known as OHS Reports in Victoria)",
        body: (
          <p>
            Safety Reports are sometimes called WHS Reports, OHS Reports, Duty of Care Reports and the like. In essence, each are similar in that the purpose of a Safety
            Report is to identify any risk of harm to people or potential damage to property from both a Common Law Duty of Care and a WHS legislative requirement.
          </p>
        ),
      },
      {
        id: "safety-obligations",
        heading: "Safety Obligations",
        body: (
          <p>
            A property has to be without risks to the health and safety of any person. Our Work Health and Safety Inspections take a practical and sensible approach to
            dealing with and recommending the best treatment of any hazards and any likely risks associated with those hazards.
          </p>
        ),
      },
      {
        id: "legislative-obligations",
        heading: "Legislative Obligations",
        body: (
          <p>
            For NSW, and the ACT, our Safety Report addresses your general obligations under the respective{" "}
            <a href="http://www.legislation.nsw.gov.au/maintop/view/inforce/act+10+2011+cd+0+N" rel="noopener external">
              Work Health and Safety Act 2011
            </a>{" "}
            and the{" "}
            <a href="http://www.legislation.nsw.gov.au/maintop/view/inforce/subordleg+674+2011+cd+0+N" rel="noopener external">
              Work Health and Safety Regulation 2011
            </a>{" "}
            and your Common Law Duty of Care.
          </p>
        ),
      },
      {
        id: "types-of-hazards",
        heading: "Types of Hazards",
        body: (
          <p>
            Some of the typical hazards can be identified in a number of broad categories and these hazards include, trip, fall, electrical, protrusion, slip, amongst
            many others.
          </p>
        ),
      },
      {
        id: "proper-risk-assessment",
        heading: "Proper Risk Assessment",
        body: (
          <>
            <p>We carry out a separate and proper Risk Assessment of each identified hazard so that you can more easily prioritise your resources.</p>
            <p>
              Our Safety Report is NOT a current standards compliance report where every structure and item has to be brought up to the current Building Code of
              Australia standards. Our Safety Reports focus on genuine hazards and risks to people and property.
            </p>
          </>
        ),
      },
      {
        id: "ordering",
        heading: "Ordering a Safety Report",
        body: (
          <>
            <p>When we receive your instructions we will</p>
            <ul>
              <li>physically carry out an inspection of the property</li>
              <li>take a practical and flexible approach to control measures to either eliminate or minimise any hazard</li>
              <li>
                prioritise risk by carrying out a proper Risk Assessment for each identified hazard so that the Owners can decide which hazards should be rectified first
              </li>
              <li>carry out a visual inspection of the electrical board if access is provided on the day of inspection, although we are not electrical engineers</li>
              <li>provide colour photographs, the location and description of any hazards that are identified on the subject property</li>
              <li>provide a thorough explanation within our WHS Report</li>
            </ul>
          </>
        ),
      },
      {
        id: "further-services",
        heading: "Further Services",
        body: (
          <p>
            In addition to carrying out Work Health and Safety Reports including &apos;Common Law Duty of Care&apos; Reports (WHS and OHS), we also assess and prepare
            Asbestos Registers and Asbestos Management Plans, Sinking Fund Plans, Reserve Fund Plans and Maintenance Fund Plans, Building Insurance Valuations, and Common
            Property Repair and Maintenance Reports.
          </p>
        ),
      },
      turnaround,
    ],
  },

  asb: {
    key: "asb",
    title: "Asbestos Report",
    cardTitle: "Asbestos Reports",
    summary: "An Asbestos Report is a term developed by BIV Reports Pty limited and includes BOTH an Asbestos Register and an Asbestos Management Plan.",
    mark: "/images/marks/asb.png",
    quadrant: "bottom",
    sections: [
      {
        id: "why-do-i-need-an-asbestos-report",
        heading: "Why Do I Need an Asbestos Report?",
        body: (
          <p>
            An Asbestos Report is a term developed by BIV Reports Pty limited and includes BOTH an Asbestos Register and an Asbestos Management Plan. In NSW and the ACT,
            the Work Health and Safety legislation an Asbestos Register is mandatory for all commercial, retail, industrial and mixed use residential properties that
            contain a common property workplace built before 31 December 2003.
          </p>
        ),
      },
      {
        id: "asbestos-reports",
        heading: "Asbestos Reports",
        body: (
          <p>
            There are requirements under Work Health and Safety legislation to prepare and display an Asbestos Register at a workplace. In addition, an Asbestos
            Management Plan has to be implemented and reviewed periodically.
          </p>
        ),
      },
      {
        id: "asbestos-register",
        heading: "Asbestos Register",
        body: (
          <>
            <p>An Asbestos Register identifies Asbestos or Asbestos Containing Material (ACM) and where it is located on the subject property.</p>
            <p>A complying Asbestos Register has the following minimum features</p>
            <ul>
              <li>a proper Risk Assessment has been carried out on each identified item</li>
              <li>appropriate control measures and hierarchy of control to limit the exposure to the ACM</li>
              <li>whether the ACM is non-friable, or friable (able to be crushed with hand pressure)</li>
              <li>identification of the size and extent of the ACM</li>
              <li>the type or name of the ACM product</li>
              <li>the specific location of any ACM</li>
              <li>whether the ACM is accessible</li>
              <li>the condition of the ACM,</li>
              <li>the contamination risk</li>
              <li>amongst other things</li>
            </ul>
          </>
        ),
      },
      {
        id: "asbestos-management-plan",
        heading: "Asbestos Management Plan",
        body: (
          <>
            <p>
              An Asbestos Management Plan sets out the way in which the Asbestos or ACM is to be treated, for example, whether using a hierarchy of controls or simply
              left in place and continually monitored.
            </p>
            <p>A complying Asbestos Management Plan contains the following minimum information</p>
            <ul>
              <li>the date to commence and date to complete any proposed works</li>
              <li>the person responsible for implementing the control measures</li>
              <li>the recommended control measures</li>
              <li>the size and extent of the ACM</li>
              <li>the location of the item</li>
              <li>the item description</li>
              <li>amongst other things</li>
            </ul>
          </>
        ),
      },
      {
        id: "legislative-requirements",
        heading: "Legislative Requirements",
        body: (
          <p>
            For those States that have adopted the Model Work Health and Safety legislation the key clauses dealing with Asbestos are contained in Clauses 422 to 430 of
            the Model Regulation.
          </p>
        ),
      },
      {
        id: "assumed-asbestos",
        heading: "Assumed Asbestos",
        body: (
          <p>
            Clause 422(2) allows a competent person who reasonably believes that the material contains asbestos to <em className="emphasis-underline">assume</em> that
            the material is ACM. Sub-clause (4) states that &apos;If asbestos or ACM is assumed to be present at a workplace,{" "}
            <em className="emphasis-underline">it is taken to be identified</em> at the workplace.&apos;
          </p>
        ),
      },
      {
        id: "testing",
        heading: "Testing",
        body: (
          <>
            <p>
              Clause 423(1) states that &apos;A person with management or control of a workplace <em className="emphasis-underline">may</em> identify asbestos or ACM by
              arranging for a sample of material at the workplace to be analysed for the presence of asbestos or ACM.&apos;
            </p>
            <p>
              There is no legislative requirement for any samples to be tested. In fact the key principle in dealing with Asbestos or ACM is that the material NOT BE
              DISTURBED. Unfortunately, some people believe that it is acceptable to gouge, cut, break, damage and disturb Asbestos or ACM in order to obtain a sample to
              be tested. This practice simply increases the risk of releasing dangerous asbestos fibres into the air and the local environment for no real positive gain,
              regardless of sealing the damaged material with PVA, paint and the like.
            </p>
            <p>
              BIV Reports Pty Limited does not recommend that Asbestos and ACM be disturbed for the purpose of obtaining samples for testing. However, in those rare
              circumstances where work is to be carried out on or near an item identified as Asbestos or ACM, then BIV Reports Pty Limited can obtain a sample using the
              appropriate National Safe Codes of Practice with our trained asbestos Inspectors. Each sample will then be tested by a NATA Accredited laboratory.
            </p>
          </>
        ),
      },
      {
        id: "prudent-to-obtain",
        heading: "It Is Prudent to Obtain an Asbestos Report",
        body: (
          <>
            <p>
              Although there are specific exemptions under the Work Health and Safety legislation for some residential strata schemes in some States, none of these
              exemptions protect the owner from legal action from a breach of their Common Law Duty of Care. Asbestos is a known dangerous material and as such, each
              owner has a Duty of Care to ensure that no harm comes to anyone as a result of the asbestos on that property.
            </p>
            <p>
              For the small fee (from $330 inc gst) of obtaining an Asbestos Report from BIV Reports Pty Limited an Owners Corporation or Property Owner can obtain a
              significant degree of protection in not only knowing what items may contain asbestos, but also being able to demonstrate that they have taken prudent steps
              in identifying hazards on their property.
            </p>
          </>
        ),
      },
      {
        id: "fines",
        heading: "Fines for Not Obtaining an Asbestos Report",
        body: (
          <>
            <p>
              There are significant fines for not complying with the Asbestos Register and Asbestos Management Plan requirements under Work Health and Safety
              legislation, particularly if someone was injured as a result of your negligence.
            </p>
            <div className="table-scroll" role="region" aria-labelledby="fines-caption" tabIndex={0}>
              <table className="data-table">
                <caption id="fines-caption">Maximum penalties by category of offence</caption>
                <thead>
                  <tr>
                    <th scope="col">Category of the Offence</th>
                    <th scope="col">Maximum Penalty for a Corporation</th>
                    <th scope="col">Maximum Penalty for an Officer</th>
                    <th scope="col">Maximum Penalty for a Worker</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <strong>Category 1:</strong> Breach of a health and safety duty involving reckless conduct with the risk of death or serious injury or illness
                      without reasonable excuse (s31)
                    </th>
                    <td>$3,000,000</td>
                    <td>$600,000 or 5 years’ imprisonment</td>
                    <td>$300,000 or 5 years’ imprisonment</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <strong>Category 2:</strong> Breach of a health and safety duty exposing an individual to death or serious injury or illness - no recklessness
                      (s32)
                    </th>
                    <td>$1,500,000</td>
                    <td>$300,000</td>
                    <td>$150,000</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <strong>Category 3:</strong> Failure to Comply with a Health and Safety Duty (s33)
                    </th>
                    <td>$500,000</td>
                    <td>$100,000</td>
                    <td>$50,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        id: "ordering",
        heading: "Ordering an Asbestos Report",
        body: (
          <>
            <p>When we receive your instructions we will</p>
            <ul>
              <li>inspect the subject property</li>
              <li>take a practical and flexible approach to control measures to either eliminate or minimise any Asbestos or ACM hazard</li>
              <li>
                prioritise risk by carrying out a proper Risk Assessment for each identified Asbestos or ACM hazard so that the Owners can decide which hazards should be
                rectified first
              </li>
              <li>carry out a visual inspection only of each item that may be Asbestos or ACM</li>
              <li>provide colour photographs, the location and description of any Asbestos or ACM hazards that are identified on the subject property</li>
              <li>provide a thorough explanation within our Asbestos Report</li>
            </ul>
          </>
        ),
      },
      {
        id: "further-services",
        heading: "Further Services",
        body: (
          <p>
            In addition to carrying out Asbestos Registers and Asbestos Management Plans, we also assess and prepare Work Health and Safety Reports including &apos;Common
            Law Duty of Care&apos; Reports (WHS and OHS), Sinking Fund Plans, Reserve Fund Plans and Maintenance Fund Plans, Building Insurance Valuations, and Common
            Property Repair and Maintenance Reports.
          </p>
        ),
      },
      turnaround,
    ],
  },
};
