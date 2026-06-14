import { notFound } from "next/navigation";
import { AppBar } from "@/lib/components/AppBar";
import { CapsuleForm } from "@/lib/components/CapsuleForm";
import { updateCapsuleAction } from "@/lib/actions/capsule";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function EditCapsulePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const user = await requireUser(lang, `/${lang}/capsules/${id}/edit`);
  const dict = await getDictionary(lang);

  const capsule = await prisma.capsule.findUnique({ where: { id } });
  if (!capsule || capsule.userId !== user.id) notFound();

  return (
    <>
      <AppBar title={dict.capsule.editTitle} backHref={`/${lang}/capsules/${id}`} />
      <CapsuleForm
        lang={lang}
        dict={dict}
        action={updateCapsuleAction}
        submitLabel={dict.capsule.saveCta}
        initial={{
          id: capsule.id,
          title: capsule.title,
          content: capsule.content,
          openDate: capsule.openDate.toISOString().slice(0, 10),
          isPublic: capsule.isPublic,
          imageUrl: capsule.imageUrl,
        }}
      />
    </>
  );
}
