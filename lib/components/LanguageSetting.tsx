"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/components/ui";

// 언어별 자기 이름(endonym) — UI 로케일과 무관하게 각 언어로 표시
const endonym: Record<Locale, string> = { ko: "한국어", en: "English" };

const localePrefix = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

export function LanguageSetting({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(target: Locale) {
    if (target === lang) return;
    // 선택을 기억해 다음 방문(루트 진입) 때도 유지 — proxy.ts가 이 쿠키를 우선한다
    document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000;samesite=lax`;
    const rest = pathname.replace(localePrefix, "");
    router.push(`/${target}${rest || ""}`);
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-bold text-ink">{label}</h3>
      <div className="flex gap-1 rounded-card bg-surface p-1">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-pressed={l === lang}
            className={cn(
              "flex-1 rounded-[10px] py-2.5 text-[14px] font-semibold transition",
              l === lang ? "bg-bg text-brand shadow-card" : "text-muted active:bg-line/40",
            )}
          >
            {endonym[l]}
          </button>
        ))}
      </div>
    </div>
  );
}
