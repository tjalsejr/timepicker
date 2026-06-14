"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema, loginSchema } from "@/lib/validation";
import { isLocale, defaultLocale } from "@/lib/i18n/config";

export type AuthState = { error?: string } | undefined;

function resolveLang(value: FormDataEntryValue | null) {
  const lang = String(value ?? "");
  return isLocale(lang) ? lang : defaultLocale;
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const lang = resolveLang(formData.get("lang"));
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "invalid" };

  const callbackUrl = String(formData.get("callbackUrl") || `/${lang}/my`);

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "invalid" };
    throw error; // redirect 등 프레임워크 제어 예외는 다시 던짐
  }
  return undefined;
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const lang = resolveLang(formData.get("lang"));
  const parsed = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "generic" };
  }

  const { username, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "emailTaken" };

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { username, email, password: hashed },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: `/${lang}/my`,
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "generic" };
    throw error;
  }
  return undefined;
}

export async function logoutAction(formData: FormData) {
  const lang = resolveLang(formData.get("lang"));
  await signOut({ redirectTo: `/${lang}` });
}

export async function googleLoginAction(formData: FormData) {
  const lang = resolveLang(formData.get("lang"));
  await signIn("google", { redirectTo: `/${lang}/my` });
}
