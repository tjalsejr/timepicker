"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "./ui";

// 사용자 화면(뷰포트) 하단에서 올라오는 바텀시트.
// position: fixed 라 변형(transform) 조상이 없는 한 화면 기준으로 배치된다.
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  // 열려 있을 때 Esc 닫기 + 본문 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50",
        open ? "" : "pointer-events-none",
      )}
    >
      {/* 스크림 */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      {/* 시트 — 화면 하단 중앙(480px 컬럼) */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-full max-w-[480px] rounded-t-[20px] bg-bg pb-[max(1.25rem,env(safe-area-inset-bottom))]",
            "shadow-[0_-4px_16px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out",
            open ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex justify-center pt-3">
            <span className="h-1 w-10 rounded-full bg-line" />
          </div>
          {title ? (
            <h2 className="px-5 pt-3 text-[18px] font-bold text-ink">{title}</h2>
          ) : null}
          <div className="px-5 pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
