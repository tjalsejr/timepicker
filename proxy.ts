import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

// 선호 로케일 추정: ① 사용자가 프로필에서 고른 NEXT_LOCALE 쿠키 → ② Accept-Language
function getLocale(request: NextRequest): string {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) {
    return cookie;
  }
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header.split(",")[0]?.split("-")[0]?.toLowerCase();
  if (preferred && (locales as readonly string[]).includes(preferred)) {
    return preferred;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 경로에 이미 로케일이 있으면 통과
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  // 로케일이 없으면 추정한 로케일로 리다이렉트
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // api, _next, 정적 파일(확장자 포함), 메타데이터 파일 제외
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|opengraph-image|twitter-image|.*\\..*).*)",
  ],
};
