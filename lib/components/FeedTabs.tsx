import Link from "next/link";
import { cn } from "./ui";

// 피드 필터 탭 (세그먼트형 pill) — 활성 탭은 다크 pill
export function FeedTabs({
  basePath,
  active,
  tabs,
}: {
  basePath: string;
  active: string;
  tabs: Array<{ key: string; label: string }>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-5 py-1">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const href =
          tab.key === "all" ? basePath : `${basePath}?tab=${tab.key}`;
        return (
          <Link
            key={tab.key}
            href={href}
            scroll={false}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold transition",
              isActive
                ? "bg-ink text-white"
                : "bg-surface text-caption active:brightness-95",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
