import { notFound, redirect } from "next/navigation";
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
      {/* 홈과 같은 그라데이션 히어로 (아이콘 없이) */}
      <section className="relative overflow-hidden px-5 pb-2 pt-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-light to-transparent" />
        <div className="relative flex flex-col items-center gap-2 text-center">
          <h2 className="text-[26px] font-extrabold text-ink">
            {dict.app.name}
          </h2>
          <p className="text-[15px] leading-relaxed text-muted">
            {dict.app.tagline}
          </p>
        </div>
      </section>
      <div className="px-5 pb-10 pt-4">
        <LoginForm lang={lang} dict={dict} callbackUrl={callbackUrl} />
      </div>
    </>
  );
}
