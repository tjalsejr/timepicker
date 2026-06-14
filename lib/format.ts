import type { Locale } from "@/lib/i18n/config";

export function formatDate(date: Date, lang: Locale) {
  return new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// 개봉일까지 남은 일수 (음수면 이미 지남)
export function daysUntil(date: Date) {
  const ms = date.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export type CapsuleStatus = "locked" | "openable";

export function getCapsuleStatus(openDate: Date): CapsuleStatus {
  return openDate.getTime() > Date.now() ? "locked" : "openable";
}

// 2026.05.30 형태
export function formatDot(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

// 로컬 타임존 기준 yyyy-mm-dd (date input value / 개봉일 비교용)
export function localDateISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 내일 — 개봉일 최소 선택값 (오늘 이후만 허용)
export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return localDateISO(d);
}

// "27분 전" / "27m ago" 형태의 상대 시간
export function formatRelative(date: Date, lang: Locale) {
  const diff = Date.now() - date.getTime();
  const sec = Math.max(0, Math.floor(diff / 1000));
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (lang === "ko") {
    if (sec < 60) return "방금 전";
    if (min < 60) return `${min}분 전`;
    if (hr < 24) return `${hr}시간 전`;
    if (day < 7) return `${day}일 전`;
    return formatDot(date);
  }
  if (sec < 60) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;
  return formatDot(date);
}
