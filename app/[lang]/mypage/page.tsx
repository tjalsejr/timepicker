import { notFound } from "next/navigation";
import Image from "next/image";
import { IconUser as UserIcon } from "@tabler/icons-react";
import { AppBar } from "@/lib/components/AppBar";
import { Card } from "@/lib/components/ui";
import { ProfileForm } from "@/lib/components/ProfileForm";
import { LanguageSetting } from "@/lib/components/LanguageSetting";
import { LogoutButton } from "@/lib/components/CapsuleInteractions";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/format";

export default async function MyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const sessionUser = await requireUser(lang, `/${lang}/mypage`);
  const dict = await getDictionary(lang);

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: { _count: { select: { capsules: true } } },
  });
  if (!user) notFound();

  return (
    <>
      <AppBar title={dict.profile.title} />

      <div className="flex flex-col gap-5 px-5 py-6">
        <Card className="flex items-center gap-4">
          <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface text-caption">
            {user.image ? (
              <Image src={user.image} alt="" fill className="object-cover" sizes="64px" />
            ) : (
              <UserIcon className="size-8" />
            )}
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-[18px] font-bold text-ink">{user.username}</p>
            <p className="text-[13px] text-muted">{user.email}</p>
            <p className="tabular text-[12px] text-caption">
              {dict.profile.joinedAt} {formatDate(user.createdAt, lang)}
            </p>
          </div>
        </Card>

        <div className="flex gap-3">
          <Card className="flex-1 text-center">
            <p className="text-[24px] font-bold text-ink tabular">
              {user._count.capsules}
            </p>
            <p className="text-[13px] text-muted">{dict.profile.capsuleCount}</p>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-[15px] font-bold text-ink">{dict.profile.edit}</h3>
          <ProfileForm
            lang={lang}
            dict={dict}
            initialUsername={user.username}
          />
        </div>

        <LanguageSetting lang={lang} label={dict.profile.language} />

        <LogoutButton lang={lang} dict={dict} />
      </div>
    </>
  );
}
