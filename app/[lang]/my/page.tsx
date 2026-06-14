import { notFound } from "next/navigation";
import Link from "next/link";
import { IconPlus as Plus, IconMailbox as Mailbox } from "@tabler/icons-react";
import { AppBar } from "@/lib/components/AppBar";
import { CapsuleCard } from "@/lib/components/CapsuleCard";
import { EmptyState, ButtonLink } from "@/lib/components/ui";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { requireUser } from "@/lib/session";

export default async function MyCapsulesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const user = await requireUser(lang, `/${lang}/my`);
  const dict = await getDictionary(lang);

  const capsules = await prisma.capsule.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { likes: true, comments: true } } },
  });

  return (
    <>
      <AppBar
        title={dict.my.title}
        right={
          <Link
            href={`/${lang}/capsules/new`}
            aria-label={dict.nav.create}
            transitionTypes={["nav-forward"]}
            className="flex size-10 items-center justify-center rounded-full text-brand active:bg-surface"
          >
            <Plus className="size-6" />
          </Link>
        }
      />

      <div className="flex flex-col gap-3 px-5 py-4">
        {capsules.length === 0 ? (
          <EmptyState
            icon={<Mailbox className="size-10" />}
            title={dict.my.empty}
            action={
              <ButtonLink
                href={`/${lang}/capsules/new`}
                transitionTypes={["nav-forward"]}
                size="md"
              >
                {dict.my.emptyCta}
              </ButtonLink>
            }
          />
        ) : (
          <>
            <p className="px-1 text-[13px] text-caption">
              {capsules.length} {dict.my.count}
            </p>
            {capsules.map((c) => (
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
                  likeCount: c._count.likes,
                  commentCount: c._count.comments,
                }}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
