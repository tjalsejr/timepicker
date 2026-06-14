"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { capsuleSchema, createCapsuleSchema, commentSchema } from "@/lib/validation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";

function resolveLang(value: FormDataEntryValue | null): Locale {
  const lang = String(value ?? "");
  return isLocale(lang) ? lang : defaultLocale;
}

export type FormState = { error?: string; ok?: boolean } | undefined;

export async function createCapsuleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const lang = resolveLang(formData.get("lang"));
  const user = await requireUser(lang);

  const parsed = createCapsuleSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    openDate: formData.get("openDate"),
    isPublic: formData.get("isPublic") === "on" || formData.get("isPublic") === "true",
    imageUrl: formData.get("imageUrl") ?? "",
  });
  if (!parsed.success) {
    const pastDate = parsed.error.issues.some((i) => i.message === "pastDate");
    return { error: pastDate ? "pastDate" : "invalid" };
  }

  const { title, content, openDate, isPublic, imageUrl } = parsed.data;

  await prisma.capsule.create({
    data: {
      title,
      content,
      openDate: new Date(openDate),
      isPublic,
      imageUrl: imageUrl || null,
      userId: user.id,
    },
  });

  revalidatePath(`/${lang}/my`);
  revalidatePath(`/${lang}/explore`);
  redirect(`/${lang}/my`);
}

export async function updateCapsuleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const lang = resolveLang(formData.get("lang"));
  const user = await requireUser(lang);
  const id = String(formData.get("id") ?? "");

  const existing = await prisma.capsule.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) return { error: "generic" };

  const parsed = capsuleSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    openDate: formData.get("openDate"),
    isPublic: formData.get("isPublic") === "on" || formData.get("isPublic") === "true",
    imageUrl: formData.get("imageUrl") ?? "",
  });
  if (!parsed.success) return { error: "invalid" };

  const { title, content, openDate, isPublic, imageUrl } = parsed.data;

  await prisma.capsule.update({
    where: { id },
    data: {
      title,
      content,
      openDate: new Date(openDate),
      isPublic,
      imageUrl: imageUrl || null,
    },
  });

  revalidatePath(`/${lang}/my`);
  revalidatePath(`/${lang}/capsules/${id}`);
  redirect(`/${lang}/my`);
}

export async function deleteCapsuleAction(formData: FormData) {
  const lang = resolveLang(formData.get("lang"));
  const user = await requireUser(lang);
  const id = String(formData.get("id") ?? "");

  const existing = await prisma.capsule.findUnique({ where: { id } });
  if (existing && existing.userId === user.id) {
    await prisma.capsule.delete({ where: { id } });
  }

  revalidatePath(`/${lang}/my`);
  revalidatePath(`/${lang}/explore`);
  redirect(`/${lang}/my`);
}

export async function toggleLikeAction(formData: FormData) {
  const lang = resolveLang(formData.get("lang"));
  const user = await requireUser(lang);
  const capsuleId = String(formData.get("capsuleId") ?? "");

  const existing = await prisma.like.findUnique({
    where: { capsuleId_userId: { capsuleId, userId: user.id } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { capsuleId, userId: user.id } });
  }

  revalidatePath(`/${lang}/capsules/${capsuleId}`);
}

export async function addCommentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const lang = resolveLang(formData.get("lang"));
  const user = await requireUser(lang);
  const capsuleId = String(formData.get("capsuleId") ?? "");

  const parsed = commentSchema.safeParse({ content: formData.get("content") });
  if (!parsed.success) return { error: "invalid" };

  await prisma.comment.create({
    data: { content: parsed.data.content, capsuleId, userId: user.id },
  });

  revalidatePath(`/${lang}/capsules/${capsuleId}`);
  return { ok: true };
}
