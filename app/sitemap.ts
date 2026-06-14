import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { siteUrl as baseUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/explore", "/login", "/register"];
  const now = new Date();

  return locales.flatMap((lang) =>
    paths.map((path) => ({
      url: `${baseUrl}/${lang}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
  );
}
