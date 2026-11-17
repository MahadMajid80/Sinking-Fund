import type { MetadataRoute } from "next";
import { SITE_INDEXABLE, absoluteUrl, routeList } from "@/lib/site";

// Built from the same canonical route inventory as page canonicals.
// lastModified is omitted deliberately: no verified modification dates exist for the content.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_INDEXABLE) return [];
  return routeList.map((r) => ({ url: absoluteUrl(r.path) }));
}
