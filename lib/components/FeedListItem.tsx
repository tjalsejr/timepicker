import Link from "next/link";
import Image from "next/image";
import { IconHeart as Heart, IconMessageCircle as MessageCircle, IconLock as Lock } from "@tabler/icons-react";
import { getCapsuleStatus, formatRelative } from "@/lib/format";
import type { CapsuleCardData } from "./CapsuleCard";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

// 피드 리스트 아이템 — 제목 + 시간 + (썸네일 우측), 토스 뉴스 피드 스타일
export function FeedListItem({
  capsule,
  href,
  lang,
  dict,
}: {
  capsule: CapsuleCardData;
  href: string;
  lang: Locale;
  dict: Dictionary;
}) {
  const locked = getCapsuleStatus(capsule.openDate) === "locked";

  return (
    <Link
      href={href}
      transitionTypes={["nav-forward"]}
      className="flex items-start gap-3 py-4 active:opacity-60"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug text-ink">
          {capsule.title}
        </h3>
        <div className="flex items-center gap-2 text-[12px] text-caption">
          {capsule.createdAt ? (
            <span className="tabular">
              {formatRelative(capsule.createdAt, lang)}
            </span>
          ) : null}
          {locked ? (
            <span className="inline-flex items-center gap-0.5">
              <Lock className="size-3" />
              {dict.capsule.status.locked}
            </span>
          ) : null}
          {capsule.likeCount ? (
            <span className="inline-flex items-center gap-0.5">
              <Heart className="size-3" />
              {capsule.likeCount}
            </span>
          ) : null}
          {capsule.commentCount ? (
            <span className="inline-flex items-center gap-0.5">
              <MessageCircle className="size-3" />
              {capsule.commentCount}
            </span>
          ) : null}
        </div>
      </div>
      {capsule.imageUrl ? (
        <div className="relative size-[68px] shrink-0 overflow-hidden rounded-2xl bg-surface">
          <Image
            src={capsule.imageUrl}
            alt=""
            fill
            sizes="68px"
            className="object-cover"
          />
        </div>
      ) : null}
    </Link>
  );
}
