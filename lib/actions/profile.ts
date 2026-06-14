"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { profileSchema } from "@/lib/validation";
import { isLocale, defaultLocale } from "@/lib/i18n/config";

export type FormState = { error?: string; ok?: boolean } | undefined;

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const langRaw = String(formData.get("lang") ?? "");
  const lang = isLocale(langRaw) ? langRaw : defaultLocale;
  const user = await requireUser(lang);

  const parsed = profileSchema.safeParse({ username: formData.get("username") });
  if (!parsed.success) return { error: "invalid" };

  await prisma.user.update({
    where: { id: user.id },
    data: { username: parsed.data.username },
  });

  revalidatePath(`/${lang}/mypage`);
  return { ok: true };
}
