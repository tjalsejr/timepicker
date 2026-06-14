import { notFound } from "next/navigation";
import { AppBar } from "@/lib/components/AppBar";
import { CapsuleForm } from "@/lib/components/CapsuleForm";
import { createCapsuleAction } from "@/lib/actions/capsule";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { requireUser } from "@/lib/session";

export default async function NewCapsulePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  await requireUser(lang, `/${lang}/capsules/new`);
  const dict = await getDictionary(lang);

  return (
    <>
      <AppBar title={dict.capsule.createTitle} backHref={`/${lang}/my`} />
      <CapsuleForm
        lang={lang}
        dict={dict}
        action={createCapsuleAction}
        submitLabel={dict.capsule.createCta}
      />
    </>
  );
}
