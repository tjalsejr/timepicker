import { notFound, redirect } from "next/navigation";
import { AppBar } from "@/lib/components/AppBar";
import { RegisterForm } from "@/lib/components/auth/AuthForms";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { getCurrentUser } from "@/lib/session";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const user = await getCurrentUser();
  if (user) redirect(`/${lang}/my`);

  const dict = await getDictionary(lang);

  return (
    <>
      <AppBar title={dict.auth.register} backHref={`/${lang}/login`} />
      <div className="flex flex-col gap-6 px-5 py-8">
        <h2 className="text-[22px] font-bold text-ink">{dict.auth.register}</h2>
        <RegisterForm lang={lang} dict={dict} />
      </div>
    </>
  );
}
