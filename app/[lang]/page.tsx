import { IconSend as Send, IconCalendarClock as CalendarClock, IconUsers as Users } from "@tabler/icons-react";
import { AppBar } from "@/lib/components/AppBar";
import { HeroLottie } from "@/lib/components/HeroLottie";
import { ButtonLink, Card } from "@/lib/components/ui";
import { CapsuleCard } from "@/lib/components/CapsuleCard";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const recent = await prisma.capsule.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { user: true, _count: { select: { likes: true, comments: true } } },
  });

  const features = [
    { icon: Send, title: dict.home.feature1Title, desc: dict.home.feature1Desc },
    { icon: CalendarClock, title: dict.home.feature2Title, desc: dict.home.feature2Desc },
    { icon: Users, title: dict.home.feature3Title, desc: dict.home.feature3Desc },
  ];

  return (
    <>
      <AppBar title={dict.app.name} />

      <section className="flex flex-col items-center gap-3 px-5 pt-8 pb-8 text-center">
        <HeroLottie className="size-36" />
        <h2 className="text-[26px] font-bold leading-tight text-ink">
          {dict.app.tagline}
        </h2>
        <p className="max-w-xs text-[15px] leading-relaxed text-muted">
          {dict.app.description}
        </p>
        <div className="mt-3 flex w-full flex-col gap-2">
          <ButtonLink
            href={`/${lang}/capsules/new`}
            transitionTypes={["nav-forward"]}
            block
          >
            {dict.home.heroCta}
          </ButtonLink>
          <ButtonLink
            href={`/${lang}/explore`}
            transitionTypes={["nav-forward"]}
            variant="weak"
            block
          >
            {dict.home.exploreCta}
          </ButtonLink>
        </div>
      </section>

      <section className="flex flex-col gap-2 px-5">
        {features.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-brand">
              <Icon className="size-5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-[15px] font-semibold text-ink">{title}</p>
              <p className="text-[13px] leading-relaxed text-muted">{desc}</p>
            </div>
          </Card>
        ))}
      </section>

      {recent.length > 0 ? (
        <section className="flex flex-col gap-3 px-5 pt-8">
          <h3 className="text-[18px] font-bold text-ink">
            {dict.home.recentPublic}
          </h3>
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
    </>
  );
}
