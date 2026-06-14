import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Locale } from "@/lib/i18n/config";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

// 보호 페이지에서 사용 — 미인증 시 로그인으로 리다이렉트
export async function requireUser(lang: Locale, returnTo?: string) {
  const user = await getCurrentUser();
  if (!user?.id) {
    const callback = returnTo ? `?callbackUrl=${encodeURIComponent(returnTo)}` : "";
    redirect(`/${lang}/login${callback}`);
  }
  return user;
}
