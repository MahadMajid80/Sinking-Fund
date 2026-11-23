import { PageHeader } from "@/components/PageParts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("legal");

// Transcribed verbatim from legal/index.html. Privacy copy must be checked against the actual
// form provider, analytics and data handling before production (docs/review-log.md R-19).
export default function LegalPage() {
  return (
    <>
      <PageHeader trail={["home", "legal"]} title="Legal" intro={<p>Disclaimer, privacy and links.</p>} photo="none" />
      <div className="container container--narrow prose legal">
        <nav aria-label="On This Page" className="inline-toc">
          <a href="#disclaimer">Disclaimer</a>
          <a href="#privacy">Privacy</a>
          <a href="#links">Links</a>
        </nav>
        <section id="disclaimer" aria-labelledby="disclaimer-h">
          <h2 id="disclaimer-h">Disclaimer</h2>
          <p>
            The information contained in this website is for general information purposes only. The information is provided by BIV Reports Pty Limited and while we
            endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness,
            accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the
            website for any purpose. Any reliance you place on such information is therefore strictly at your own risk. Through this website you are able to link to other
            websites which are not under the control of BIV Reports Pty Limited. We have no control over the nature, content and availability of those sites. The
            inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them. Every effort is made to keep the website up and
            running smoothly. However, we take no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond
            our control.
          </p>
        </section>
        <section id="privacy" aria-labelledby="privacy-h">
          <h2 id="privacy-h">Privacy</h2>
          <p>
            This privacy policy sets out how BIV Reports Pty Ltd uses and protects any information that you give us when you use this website. We are committed to
            ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can
            be assured that it will only be used in accordance with this privacy statement. We may change this policy from time to time by updating this page. You should
            check this page from time to time to ensure that you are happy with any changes.
          </p>
        </section>
        <section id="links" aria-labelledby="links-h">
          <h2 id="links-h">Links</h2>
          <p>
            Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have
            any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting
            such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website
            in question.
          </p>
        </section>
      </div>
    </>
  );
}
