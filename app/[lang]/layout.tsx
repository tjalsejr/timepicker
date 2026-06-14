import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { BottomTabBar } from "@/lib/components/BottomTabBar";
import { getDictionary } from "@/lib/i18n";
import { locales, isLocale } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site";

const ogLocale: Record<string, string> = { ko: "ko_KR", en: "en_US" };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3182f6",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const title = `${dict.app.name} — ${dict.app.tagline}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s · ${dict.app.name}`,
    },
    description: dict.app.description,
    applicationName: dict.app.name,
    alternates: {
      canonical: `/${lang}`,
      languages: { ko: "/ko", en: "/en" },
    },
    openGraph: {
      type: "website",
      siteName: dict.app.name,
      title,
      description: dict.app.description,
      url: `/${lang}`,
      locale: ogLocale[lang],
      alternateLocale: locales
        .filter((l) => l !== lang)
        .map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dict.app.description,
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <div className="app-shell">
          <div className="app-content">{children}</div>
          <BottomTabBar lang={lang} dict={dict} />
        </div>
      </body>
    </html>
  );
}
