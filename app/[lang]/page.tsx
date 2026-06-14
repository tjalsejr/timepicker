import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import heroPerson from "@/lib/assets/hero-idea-person.png";
import { ButtonLink } from "@/lib/components/ui";
import { CapsuleCard } from "@/lib/components/CapsuleCard";
import { FaqAccordion } from "@/lib/components/FaqAccordion";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";

// NOTE: 이 메인 페이지는 OGQ마켓 스타일 스토리텔링 랜딩으로,
// 사용자 요청에 따라 예외적으로 이모지를 사용한다(다른 화면은 이모지 금지 규칙 유지).

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const h = dict.home;

  const recent = await prisma.capsule.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { user: true, _count: { select: { likes: true, comments: true } } },
  });

  const features = [
    { emoji: "💌", title: h.feature1Title, desc: h.feature1Desc },
    { emoji: "⏳", title: h.feature2Title, desc: h.feature2Desc },
    { emoji: "🌍", title: h.feature3Title, desc: h.feature3Desc },
  ];

  return (
    <>
      {/* 1. 검은 헤더 — 로고 + CTA pill */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-[#16181d] px-5">
        <span className="text-[18px] font-extrabold tracking-tight text-white">
          {dict.app.name}
        </span>
        <Link
          href={`/${lang}/capsules/new`}
          transitionTypes={["nav-forward"]}
          className="flex h-9 items-center rounded-full bg-white px-4 text-[13px] font-bold text-[#16181d] active:brightness-90"
        >
          {h.headerCta}
        </Link>
      </header>

      {/* 2. 히어로 — 그라데이션 배경 + 아이콘 타일 + eyebrow 배지 */}
      <section className="relative overflow-hidden px-5 pb-10 pt-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-light to-transparent" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <Image
            src={heroPerson}
            alt=""
            priority
            className="size-64 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
          />
          <h1 className="text-[28px] font-extrabold leading-tight text-ink">
            {dict.app.tagline}
          </h1>
          <p className="max-w-xs text-[15px] leading-relaxed text-muted">
            {dict.app.description}
          </p>
        </div>
      </section>

      {/* 3. 피처 블록 (이모지 + 큰 제목 + 본문) */}
      <section className="flex flex-col gap-14 px-5 py-12">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col gap-3">
            <span className="text-[44px] leading-none">{f.emoji}</span>
            <h2 className="text-[26px] font-extrabold leading-tight text-ink">
              {f.title}
            </h2>
            <p className="text-[16px] leading-relaxed text-muted">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* 4. 스토리 ① — 오늘의 나 ↔ 미래의 나 대화 목업 */}
      <section className="px-5 py-10">
        <p className="text-[14px] font-bold text-brand">{h.story1Eyebrow}</p>
        <h2 className="mt-1 text-[24px] font-extrabold text-ink">
          {h.story1Title} <span className="align-middle">✍️</span>
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          {h.story1Desc}
        </p>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-surface p-4">
          {/* 받는 말풍선 — 오늘의 나 */}
          <div className="flex items-start gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[18px] shadow-card">
              🧑
            </span>
            <div className="flex flex-col items-start gap-2">
              <span className="text-[11px] text-caption">{h.mockToday}</span>
              <div className="w-fit rounded-2xl rounded-tl-md bg-white px-3 py-2 text-[14px] text-ink shadow-card">
                {h.mockTodayMsg}
              </div>
              {/* 잠긴 캡슐 카드 */}
              <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 shadow-card">
                <span className="grid size-10 place-items-center rounded-lg bg-surface text-[20px]">
                  🔒
                </span>
                <div>
                  <p className="text-[14px] font-bold text-ink">
                    {h.mockSealedTitle}
                  </p>
                  <p className="text-[12px] text-caption">{h.mockSealedHint}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 보내는 말풍선 — 미래의 나 */}
          <div className="flex flex-col items-end gap-1">
            <div className="w-fit rounded-2xl rounded-tr-md bg-brand px-3 py-2 text-[14px] text-white">
              {h.mockFutureMsg}
            </div>
            <span className="text-[11px] text-caption">{h.mockTime}</span>
          </div>
        </div>
      </section>

      {/* 5. 스토리 ② — 공개 타임캡슐 목업 */}
      <section className="px-5 py-10">
        <p className="text-[14px] font-bold text-brand">{h.story2Eyebrow}</p>
        <h2 className="mt-1 text-[24px] font-extrabold text-ink">
          {h.story2Title} <span className="align-middle">🌍</span>
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          {h.story2Desc}
        </p>

        <div className="mt-5 rounded-2xl bg-surface p-4">
          <div className="rounded-xl bg-white p-4 shadow-card">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-surface text-[16px]">
                🙂
              </span>
              <span className="text-[13px] font-semibold text-ink">
                {h.mockPublicAuthor}
              </span>
              <span className="ml-auto rounded-md bg-brand-light px-2 py-0.5 text-[11px] font-bold text-brand-hover">
                {dict.capsule.status.public}
              </span>
            </div>
            <p className="mt-3 text-[16px] font-bold text-ink">
              {h.mockPublicTitle}
            </p>
            <div className="mt-3 flex items-center gap-4 text-[13px] text-caption">
              <span>❤️ 24</span>
              <span>💬 8</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 지금 바로 시작 — 폰 목업 + 워터마크 */}
      <section className="relative overflow-hidden px-5 py-16 text-center">
        <span className="pointer-events-none absolute inset-x-0 top-28 select-none whitespace-nowrap text-center text-[72px] font-black leading-none text-blue-50">
          TimePicker
        </span>
        <div className="relative">
          <h2 className="text-[24px] font-extrabold text-ink">{h.tryTitle}</h2>
          <p className="mt-2 text-[15px] text-muted">{h.tryDesc}</p>

          <div className="mx-auto mt-8 w-64 rounded-[28px] border-[6px] border-[#16181d] bg-white shadow-float">
            <div className="flex flex-col items-center gap-3 px-5 py-8">
              <span className="text-[40px]">⏳</span>
              <p className="text-[16px] font-bold text-ink">{h.tryPhoneTitle}</p>
              <p className="text-[13px] leading-relaxed text-muted">
                {h.tryPhoneBody}
              </p>
              <span className="rounded-full bg-surface px-3 py-1 text-[12px] font-semibold text-caption">
                {h.tryPhoneDate}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 마무리 라인 (검정 배경) */}
      <section className="bg-[#16181d] px-5 py-16 text-center">
        <h2 className="whitespace-pre-line text-[26px] font-extrabold leading-snug text-white">
          {h.closingLine}
        </h2>
        <div className="mt-6 flex justify-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="size-2 rounded-full bg-blue-500" />
          ))}
        </div>
      </section>

      {/* 8. FAQ */}
      <FaqAccordion title={h.faqTitle} items={h.faq} />

      {/* 9. 최근 공개 타임캡슐 (실데이터) */}
      {recent.length > 0 ? (
        <section className="flex flex-col gap-3 px-5 py-10">
          <h3 className="text-[18px] font-bold text-ink">{h.recentPublic}</h3>
          <div className="flex flex-col gap-3">
            {recent.map((c) => (
              <CapsuleCard
                key={c.id}
                lang={lang}
                dict={dict}
                href={`/${lang}/capsules/${c.id}`}
                capsule={{
                  id: c.id,
                  title: c.title,
                  openDate: c.openDate,
                  isPublic: c.isPublic,
                  imageUrl: c.imageUrl,
                  authorName: c.user.username,
                  likeCount: c._count.likes,
                  commentCount: c._count.comments,
                }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* 10. 마지막 CTA 카드 */}
      <section className="px-5 pb-14">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface px-6 py-10 text-center">
          <span className="text-[44px]">🎁</span>
          <p className="text-[18px] font-bold text-ink">{h.ctaTitle}</p>
          <p className="text-[14px] leading-relaxed text-muted">{h.ctaDesc}</p>
          <ButtonLink
            href={`/${lang}/capsules/new`}
            transitionTypes={["nav-forward"]}
            className="mt-2"
          >
            {h.ctaButton}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
