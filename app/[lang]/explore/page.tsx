import { notFound } from "next/navigation";
import { IconSearch as Search, IconCompass as Compass } from "@tabler/icons-react";
import { AppBar } from "@/lib/components/AppBar";
import { CapsuleCard } from "@/lib/components/CapsuleCard";
import { FeedListItem } from "@/lib/components/FeedListItem";
import { FeedTabs } from "@/lib/components/FeedTabs";
import { EmptyState } from "@/lib/components/ui";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import type { Prisma } from "@/lib/generated/prisma/client";

export default async function ExplorePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; tab?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { q, tab } = await searchParams;
  const query = (q ?? "").trim();
  const activeTab = tab === "open" || tab === "popular" ? tab : "all";

  const where: Prisma.CapsuleWhereInput = {
    isPublic: true,
    ...(query ? { title: { contains: query } } : {}),
    ...(activeTab === "open" ? { openDate: { lte: new Date() } } : {}),
  };
  const orderBy: Prisma.CapsuleOrderByWithRelationInput =
    activeTab === "popular"
      ? { likes: { _count: "desc" } }
      : { createdAt: "desc" };

  const capsules = await prisma.capsule.findMany({
    where,
    orderBy,
    include: { user: true, _count: { select: { likes: true, comments: true } } },
  });

  const toData = (c: (typeof capsules)[number]) => ({
    id: c.id,
    title: c.title,
    openDate: c.openDate,
    isPublic: c.isPublic,
    imageUrl: c.imageUrl,
    authorName: c.user.username,
    likeCount: c._count.likes,
    commentCount: c._count.comments,
    createdAt: c.createdAt,
  });

  const tabs = [
    { key: "all", label: dict.explore.tabAll },
    { key: "open", label: dict.explore.tabOpen },
    { key: "popular", label: dict.explore.tabPopular },
  ];

  // 검색 중이 아니고 전체/인기 탭이면 첫 글을 히어로로
  const showFeatured = !query && capsules.length > 0;
  const featured = showFeatured ? capsules[0] : null;
  const rest = showFeatured ? capsules.slice(1) : capsules;

  return (
    <>
      <AppBar title={dict.explore.title} />

      <FeedTabs basePath={`/${lang}/explore`} active={activeTab} tabs={tabs} />

      <div className="px-5 pt-3">
        <form className="relative" action={`/${lang}/explore`} method="get">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-placeholder" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={dict.explore.searchPlaceholder}
            className="w-full rounded-[14px] border border-line bg-[rgba(0,23,51,0.02)] py-3 pl-11 pr-4 text-[15px] text-ink-strong outline-none placeholder:text-placeholder focus:border-brand"
          />
        </form>
      </div>

      {capsules.length === 0 ? (
        <EmptyState
          icon={<Compass className="size-10" />}
          title={query ? dict.explore.emptyFiltered : dict.explore.empty}
        />
      ) : (
        <>
          {featured ? (
            <section className="flex flex-col gap-3 px-5 pt-6">
              <h2 className="text-[18px] font-bold text-ink">
                {dict.explore.featured}
              </h2>
              <CapsuleCard
                lang={lang}
                dict={dict}
                href={`/${lang}/capsules/${featured.id}`}
                capsule={toData(featured)}
              />
            </section>
          ) : null}

          {rest.length > 0 ? (
            <section className="px-5 pt-6">
              <h2 className="text-[18px] font-bold text-ink">
                {query ? dict.explore.searchResult : dict.explore.latest}
              </h2>
              <ul className="divide-y divide-line">
                {rest.map((c) => (
                  <li key={c.id}>
                    <FeedListItem
                      lang={lang}
                      dict={dict}
                      href={`/${lang}/capsules/${c.id}`}
                      capsule={toData(c)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </>
  );
}
