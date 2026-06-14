import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site";

// 로그인이 필요한 보호 경로는 크롤링에서 제외한다 (로케일별).
const protectedPaths = ["my", "mypage", "capsules/new"];

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/",
    ...locales.flatMap((lang) => protectedPaths.map((p) => `/${lang}/${p}`)),
  ];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
