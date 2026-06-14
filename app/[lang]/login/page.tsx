import { notFound, redirect } from "next/navigation";
import { IconHourglass as Hourglass } from "@tabler/icons-react";
import { AppBar } from "@/lib/components/AppBar";
import { LoginForm } from "@/lib/components/auth/AuthForms";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { getCurrentUser } from "@/lib/session";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const user = await getCurrentUser();
  if (user) redirect(`/${lang}/my`);

  const dict = await getDictionary(lang);
  const { callbackUrl } = await searchParams;

  return (
    <>
      <AppBar title={dict.auth.login} backHref={`/${lang}`} />
      <div className="flex flex-col gap-6 px-5 py-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-light text-brand">
            <Hourglass className="size-6" />
          </span>
          <h2 className="text-[22px] font-bold text-ink">{dict.app.name}</h2>
          <p className="text-[14px] text-muted">{dict.app.tagline}</p>
        </div>
        <LoginForm lang={lang} dict={dict} callbackUrl={callbackUrl} />
      </div>
    </>
  );
}
