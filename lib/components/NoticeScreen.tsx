"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ko from "@/lib/i18n/dictionaries/ko";
import en from "@/lib/i18n/dictionaries/en";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

const dicts = { ko, en };

// 클라이언트 경계(error/not-found)에서 경로의 로케일을 읽어 사전을 고른다.
export function useLocaleDict() {
  const pathname = usePathname();
  const seg = pathname?.split("/")[1] ?? "";
  const locale: Locale = isLocale(seg) ? seg : defaultLocale;
  return { locale, dict: dicts[locale] };
}

// 에러/404 등 전체 화면 안내 UI (공용)
export function NoticeScreen({
  icon,
  title,
  description,
  action,
  tone = "neutral",
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action: ReactNode;
  tone?: "neutral" | "warning";
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span
        className={
          "flex size-14 items-center justify-center rounded-full bg-surface " +
          (tone === "warning" ? "text-warning" : "text-caption")
        }
      >
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-[16px] font-bold text-ink">{title}</p>
        {description ? (
          <p className="text-[13px] text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
