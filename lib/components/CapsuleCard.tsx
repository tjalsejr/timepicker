import Link from "next/link";
import Image from "next/image";
import { IconHeart as Heart, IconMessageCircle as MessageCircle, IconClock as Clock } from "@tabler/icons-react";
import { StatusBadge } from "./StatusBadge";
import { getCapsuleStatus, formatDate } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export type CapsuleCardData = {
  id: string;
  title: string;
  openDate: Date;
  isPublic: boolean;
  imageUrl: string | null;
  authorName?: string;
  likeCount?: number;
  commentCount?: number;
  createdAt?: Date;
};

export function CapsuleCard({
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
  const status = getCapsuleStatus(capsule.openDate);

  return (
    <Link
      href={href}
      transitionTypes={["nav-forward"]}
      className="block overflow-hidden rounded-card bg-bg shadow-card transition active:scale-[0.99]"
    >
      {capsule.imageUrl ? (
        <div className="relative aspect-[16/9] w-full bg-surface">
          <Image
            src={capsule.imageUrl}
            alt={capsule.title}
            fill
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={status} isPublic={capsule.isPublic} dict={dict} />
          {capsule.authorName ? (
            <span className="truncate text-[12px] text-caption">
              {capsule.authorName}
            </span>
          ) : null}
        </div>
        <h3 className="line-clamp-1 text-[16px] font-bold text-ink">
          {capsule.title}
        </h3>
        <div className="flex items-center gap-3 text-[12px] text-caption">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {dict.capsule.openOn} {formatDate(capsule.openDate, lang)}
          </span>
          {typeof capsule.likeCount === "number" ? (
            <span className="inline-flex items-center gap-1">
              <Heart className="size-3.5" />
              {capsule.likeCount}
            </span>
          ) : null}
          {typeof capsule.commentCount === "number" ? (
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {capsule.commentCount}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
