import { FaqTemplate } from "@/components/FaqTemplate";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("faqBiv");

export default function Page() {
  return <FaqTemplate service="biv" />;
}
