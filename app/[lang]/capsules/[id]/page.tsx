import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IconLock as Lock, IconPencil as Pencil, IconMessageCircle as MessageCircle, IconCalendarClock as CalendarClock } from "@tabler/icons-react";
import { AppBar } from "@/lib/components/AppBar";
import { StatusBadge } from "@/lib/components/StatusBadge";
import { AuthorCard } from "@/lib/components/AuthorCard";
import {
  LikeButton,
  CommentForm,
  DeleteCapsuleButton,
} from "@/lib/components/CapsuleInteractions";
import { EmptyState } from "@/lib/components/ui";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { getCurrentUser } from "@/lib/session";
import { getCapsuleStatus, formatDate, formatDot, daysUntil } from "@/lib/format";

export default async function CapsuleDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const user = await getCurrentUser();

  const capsule = await prisma.capsule.findUnique({
    where: { id },
    include: {
      user: true,
      _count: { select: { likes: true, comments: true } },
      comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
      likes: user ? { where: { userId: user.id } } : false,
    },
  });

  if (!capsule) notFound();

  const isOwner = !!user && capsule.userId === user.id;
  // 비공개 캡슐은 소유자만 열람 가능
  if (!capsule.isPublic && !isOwner) notFound();

  const status = getCapsuleStatus(capsule.openDate);
  const locked = status === "locked";
  const liked = Array.isArray(capsule.likes) && capsule.likes.length > 0;

  return (
    <>
      <AppBar
        title={capsule.title}
        backHref={isOwner ? `/${lang}/my` : `/${lang}/explore`}
        right={
          isOwner ? (
            <Link
              href={`/${lang}/capsules/${capsule.id}/edit`}
              aria-label={dict.common.edit}
              transitionTypes={["nav-forward"]}
              className="flex size-10 items-center justify-center rounded-full text-ink-soft active:bg-surface"
            >
              <Pencil className="size-5" />
            </Link>
          ) : null
        }
      />

      <article className="flex flex-col gap-4 px-5 py-6">
        {/* 태그 칩 */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[13px] font-semibold text-ink-soft">
            #{dict.capsule.category}
          </span>
          <StatusBadge status={status} isPublic={capsule.isPublic} dict={dict} />
        </div>

        <h1 className="text-[26px] font-bold leading-tight text-ink">
          {capsule.title}
        </h1>

        {/* 발행일 + 댓글 수 */}
        <div className="flex items-center gap-3 text-[13px] text-caption">
          <span className="tabular">{formatDot(capsule.createdAt)}</span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="size-4" />
            {capsule._count.comments}
          </span>
        </div>

        {/* 작성자 인사 카드 */}
        <AuthorCard
          name={capsule.user.username}
          image={capsule.user.image}
          hello={dict.capsule.hello}
          line={dict.capsule.fromAuthor.replace("{name}", capsule.user.username)}
        />

        {/* 개봉일 메타 */}
        <div className="flex items-center gap-1.5 text-[13px] text-muted">
          <CalendarClock className="size-4" />
          {dict.capsule.openOn} {formatDate(capsule.openDate, lang)}
        </div>

        {locked ? (
          <div className="mt-2 flex flex-col items-center gap-3 rounded-card bg-surface px-6 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-bg text-caption shadow-card">
              <Lock className="size-7" />
            </span>
            <p className="text-[16px] font-bold text-ink">
              {dict.capsule.lockedMessage}
            </p>
            <p className="text-[13px] leading-relaxed text-muted">
              {dict.capsule.lockedDesc}
            </p>
            <p className="tabular text-[13px] font-semibold text-brand">
              {Math.max(0, daysUntil(capsule.openDate))} {dict.capsule.daysLeft}
            </p>
          </div>
        ) : (
          <>
            {capsule.imageUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-card bg-surface">
                <Image
                  src={capsule.imageUrl}
                  alt={capsule.title}
                  fill
                  sizes="480px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-4">
              {capsule.content
                .split(/\n{2,}/)
                .filter((p) => p.trim())
                .map((paragraph, i) => (
                  <p
                    key={i}
                    className="whitespace-pre-line text-[16px] leading-[1.75] text-ink-strong"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
          </>
        )}

        {isOwner ? (
          <div className="flex justify-end pt-2">
            <DeleteCapsuleButton lang={lang} capsuleId={capsule.id} dict={dict} />
          </div>
        ) : null}
      </article>

      {/* 공개 + 개봉 가능한 캡슐만 좋아요/댓글 */}
      {capsule.isPublic && !locked ? (
        <section className="flex flex-col gap-4 border-t border-line px-5 py-6">
          <div className="flex items-center gap-3">
            <LikeButton
              lang={lang}
              capsuleId={capsule.id}
              liked={liked}
              count={capsule._count.likes}
            />
            <span className="inline-flex items-center gap-1.5 text-[14px] text-muted">
              <MessageCircle className="size-5" />
              {capsule._count.comments}
            </span>
          </div>

          <CommentForm lang={lang} capsuleId={capsule.id} dict={dict} />

          {capsule.comments.length === 0 ? (
            <EmptyState
              icon={<MessageCircle className="size-8" />}
              title={dict.capsule.noComments}
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {capsule.comments.map((comment) => (
                <li key={comment.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-ink-strong">
                      {comment.user.username}
                    </span>
                    <span className="tabular text-[12px] text-caption">
                      {formatDate(comment.createdAt, lang)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-ink-soft">
                    {comment.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </>
  );
}
