import { FaqTemplate } from "@/components/FaqTemplate";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("faqWhs");

export default function Page() {
  return <FaqTemplate service="whs" />;
}
