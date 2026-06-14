import Link from "next/link";
import { IconChevronLeft as ChevronLeft } from "@tabler/icons-react";
import type { ReactNode } from "react";

// 상단 앱바 — sticky, 좌측 뒤로가기 / 가운데 타이틀 / 우측 액션
export function AppBar({
  title,
  backHref,
  right,
}: {
  title?: string;
  backHref?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-1 border-b border-line bg-bg/90 px-2 backdrop-blur">
      <div className="flex w-10 justify-start">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="back"
            transitionTypes={["nav-back"]}
            className="flex size-10 items-center justify-center rounded-full text-ink-soft active:bg-surface"
          >
            <ChevronLeft className="size-6" />
          </Link>
        ) : null}
      </div>
      <h1 className="flex-1 truncate text-center text-[16px] font-semibold text-ink">
        {title}
      </h1>
      <div className="flex min-w-10 items-center justify-end pr-1">{right}</div>
    </header>
  );
}
