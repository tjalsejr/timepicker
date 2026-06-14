"use client";

import { useActionState } from "react";
import { IconCheck as Check } from "@tabler/icons-react";
import { updateProfileAction, type FormState } from "@/lib/actions/profile";
import { Field, TextField } from "@/lib/components/ui";
import { SubmitButton } from "@/lib/components/SubmitButton";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export function ProfileForm({
  lang,
  dict,
  initialUsername,
}: {
  lang: Locale;
  dict: Dictionary;
  initialUsername: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(
    updateProfileAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="lang" value={lang} />
      <Field
        label={dict.profile.username}
        error={state?.error ? dict.auth.errors.generic : undefined}
      >
        <TextField
          name="username"
          required
          minLength={2}
          maxLength={20}
          defaultValue={initialUsername}
          error={!!state?.error}
        />
      </Field>
      {state?.ok ? (
        <p className="inline-flex items-center gap-1 text-[13px] text-success">
          <Check className="size-4" />
          {dict.profile.updated}
        </p>
      ) : null}
      <SubmitButton block size="md">
        {dict.profile.saveCta}
      </SubmitButton>
    </form>
  );
}
