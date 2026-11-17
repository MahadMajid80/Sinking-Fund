import { FaqTemplate } from "@/components/FaqTemplate";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("faqAsb");

export default function Page() {
  return <FaqTemplate service="asb" />;
}
