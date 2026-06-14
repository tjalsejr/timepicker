"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  loginAction,
  registerAction,
  googleLoginAction,
  type AuthState,
} from "@/lib/actions/auth";
import { Field, TextField } from "@/lib/components/ui";
import { SubmitButton } from "@/lib/components/SubmitButton";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

type AuthErrors = Dictionary["auth"]["errors"];

function errorText(state: AuthState, errors: AuthErrors) {
  if (!state?.error) return undefined;
  return errors[state.error as keyof AuthErrors] ?? errors.generic;
}

export function GoogleButton({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  return (
    <form action={googleLoginAction}>
      <input type="hidden" name="lang" value={lang} />
      <button
        type="submit"
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-line bg-bg text-[16px] font-semibold text-ink-strong active:bg-surface"
      >
        <GoogleMark />
        {label}
      </button>
    </form>
  );
}

export function LoginForm({
  lang,
  dict,
  callbackUrl,
}: {
  lang: Locale;
  dict: Dictionary;
  callbackUrl?: string;
}) {
  const [state, action] = useActionState<AuthState, FormData>(
    loginAction,
    undefined,
  );
  const err = errorText(state, dict.auth.errors);

  return (
    <div className="flex flex-col gap-4">
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="lang" value={lang} />
        {callbackUrl ? (
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
        ) : null}
        <Field label={dict.auth.email}>
          <TextField
            name="email"
            type="email"
            autoComplete="email"
            required
            error={!!err}
          />
        </Field>
        <Field label={dict.auth.password} error={err}>
          <TextField
            name="password"
            type="password"
            autoComplete="current-password"
            required
            error={!!err}
          />
        </Field>
        <SubmitButton block>{dict.auth.loginCta}</SubmitButton>
      </form>

      <Divider label={dict.auth.or} />
      <GoogleButton lang={lang} label={dict.auth.loginWithGoogle} />

      <p className="pt-2 text-center text-[14px] text-muted">
        {dict.auth.noAccount}{" "}
        <Link
          href={`/${lang}/register`}
          transitionTypes={["nav-forward"]}
          className="font-semibold text-brand"
        >
          {dict.auth.registerCta}
        </Link>
      </p>
    </div>
  );
}

export function RegisterForm({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const [state, action] = useActionState<AuthState, FormData>(
    registerAction,
    undefined,
  );
  const err = errorText(state, dict.auth.errors);

  return (
    <div className="flex flex-col gap-4">
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="lang" value={lang} />
        <Field label={dict.auth.username}>
          <TextField name="username" autoComplete="nickname" required />
        </Field>
        <Field label={dict.auth.email}>
          <TextField name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label={dict.auth.password}>
          <TextField
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </Field>
        <Field label={dict.auth.passwordConfirm} error={err}>
          <TextField
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
            error={!!err}
          />
        </Field>
        <SubmitButton block>{dict.auth.registerCta}</SubmitButton>
      </form>

      <Divider label={dict.auth.or} />
      <GoogleButton lang={lang} label={dict.auth.loginWithGoogle} />

      <p className="pt-2 text-center text-[14px] text-muted">
        {dict.auth.haveAccount}{" "}
        <Link
          href={`/${lang}/login`}
          transitionTypes={["nav-back"]}
          className="font-semibold text-brand"
        >
          {dict.auth.loginCta}
        </Link>
      </p>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-caption">
      <span className="h-px flex-1 bg-line" />
      <span className="text-[12px]">{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
