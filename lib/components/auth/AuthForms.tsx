"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  loginAction,
  registerAction,
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

