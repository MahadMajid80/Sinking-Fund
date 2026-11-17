/**
 * The 15 original testimonials, verbatim from testimonials/index.html, in source order.
 * `attribution` is the exact source attribution line. `name` is the leading person or
 * organisation name, used only for visual emphasis; name + rest always reproduces the source.
 * Spelling in the source ("Principle", "Wadonga") is preserved; see docs/review-log.md.
 */
export interface Testimonial {
  id: string;
  quote: string;
  attribution: string;
  name: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "christine-nesbit",
    quote:
      "At Albury Wodonga Real Estate we have found that ‘BIV Reports’ provide cost effective, well written reports that are easy to follow. They offer a good service responding quickly to any urgent requests and their extensive knowledge and advice provides us with absolute confidence in their product. BIV Reports makes our job easier.",
    attribution: "Christine Nesbit Principle and Licensee - Albury Wadonga Real Estate",
    name: "Christine Nesbit",
  },
  {
    id: "bryan",
    quote:
      "The BIV Reports we receive are clear, concise and of the highest quality. I use BIV Reports for all of my necessary Reports and wouldn’t go anywhere else. Their back office is a pleasure to deal with and their prices are excellent. I have no hesitation in recommending their services.",
    attribution: "Bryan Owners Corporation Manager - Tideways",
    name: "Bryan",
  },
  {
    id: "leo-paternoster",
    quote: "They are always obliging to help. A quick service and they travel to the Far South Coast without hesitation. They have provided Plans for our Community Schemes.",
    attribution: "Leo Paternoster - Strata Management Services Nowra",
    name: "Leo Paternoster",
  },
  {
    id: "michael-antonakiou",
    quote: "Excellent simple format that is easy to understand. Keep up the good work.",
    attribution: "Michael Antonakiou - Strathfield Strata Management",
    name: "Michael Antonakiou",
  },
  {
    id: "active-strata-services",
    quote: "Competitive pricing, quick turn around & easy to read reports.",
    attribution: "Active Strata Services UpSolution Client",
    name: "Active Strata Services",
  },
  {
    id: "steve-lincoln",
    quote:
      "I placed an order two days earlier and called them at 5pm as I realised that I needed the Report for a 6pm meeting that night. By 5:45pm I had received the Sinking Fund Report as the property had been inspected the day before. An excellent service, I highly recommend them.",
    attribution: "Steve Lincoln - Hawkesbury Real Estate",
    name: "Steve Lincoln",
  },
  {
    id: "helen-davies",
    quote:
      "They are reliable, knowledgeable, and a real pleasure to deal with. They have travelled to Wagga three times in the last year and enthusiastically provide this Country service.",
    attribution: "Helen Davies - Hore & Davies , Wagga Wagga",
    name: "Helen Davies",
  },
  {
    id: "sandra-f",
    quote:
      "We obtained sample Sinking Fund Plans from six other providers and chose Sinking Fund Plans (Aust) Pty Limited because your reports were easy to understand, well presented and cost effective. Now that we have our Sinking Fund Plan and Building Insurance Valuation, I can also add how very happy we are with your excellent service and speedy delivery. Thank you. We have no hesitation in recommending your services.",
    attribution: "Sandra F - The secretary of a self managed scheme",
    name: "Sandra F",
  },
  {
    id: "michael-kimpton",
    quote:
      "We emailed a question to BIV Reports and within an hour we had a reply phone call and an answer. These guys are prompt, professional and caring. BIV Reports know their work and they know strata properties. They have valued our portfolio and we have been very happy with receiving the valuations on time and well before each insurance renewal. I recommend their service to any prudent strata manager.",
    attribution: "Michael Kimpton Director - MK Owners Corporation Services Pty Ltd",
    name: "Michael Kimpton",
  },
  {
    id: "emma-fairbrother",
    quote:
      "BIV Reports are price competitive and their Reports usually take two weeks, with urgent requests being completed in a few days. I can speak to the Directors easily and Shane Foley has attended one of my Executive Meetings to support me in explaining the purpose and utility of a Maintenance Fund Plan. In addition, queries are responded to very quickly from their office.",
    attribution: "Emma Fairbrother Strata Plan Pty Ltd",
    name: "Emma Fairbrother",
  },
  {
    id: "debbie-price",
    quote:
      "I am absolutely happy with the service provided by Sinking Fund Plans (Aust) P/L. The feedback from our clients is very good, they can easily understand their Sinking Fund Reports. When we have any queries we always get a good response from Wal or Shane. In one case we gave two days notice for a Sinking Fund Plan and they delivered in the limited time we gave them and at a very good price.",
    attribution: "Debbie Price - George Brand Strata",
    name: "Debbie Price",
  },
  {
    id: "rebecca-jarrett",
    quote: "Very speedy delivery! Easy to understand reports, good to see photos too, first Sinking Fund Plan I have ordered that’s had photos! Will use again. Thank you!",
    attribution: "Rebecca Jarrett - Strathfield Strata Management",
    name: "Rebecca Jarrett",
  },
  {
    id: "nicole-fytanis",
    quote:
      "Building Insurance Valuations are an efficient and diligent company to have associations with. The service Shane and his team provides is highly commendable and the reports provided are professional and prompt.",
    attribution: "Nicole Fytanis - Platinum Prestige Strata Management",
    name: "Nicole Fytanis",
  },
  {
    id: "andrew-gavin",
    quote:
      "The feedback we get from our owners is that their Sinking Fund Plans are very easy to read and understand. It makes my job easier as a Strata Manager if I don’t have to explain someone else’s report. They are always available for my clients to talk to.",
    attribution: "Andrew Gavin - Michael Roberts Strata Management",
    name: "Andrew Gavin",
  },
  {
    id: "steve-obrien",
    quote:
      "These guys are impressive and have the fastest turnaround for both Sinking Fund Plans and Building Insurance Valuations when required. I like their flexibility and willingness to discuss and add items to the Sinking Fund Plan without any additional charge. They are worth getting on-board.",
    attribution: "Steve O'Brien - Strata Partners",
    name: "Steve O'Brien",
  },
];

/** Splits an attribution into the emphasised name and the remainder, preserving the source text exactly. */
export function splitAttribution(t: Testimonial): { name: string; rest: string } {
  return t.attribution.startsWith(t.name) ? { name: t.name, rest: t.attribution.slice(t.name.length) } : { name: "", rest: t.attribution };
}
