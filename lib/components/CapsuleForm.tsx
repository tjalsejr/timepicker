"use client";

import { useActionState, useState, useRef } from "react";
import Image from "next/image";
import { IconPhotoPlus as ImagePlus, IconX as X, IconLoader2 as Loader2, IconWorld as Globe, IconLock as Lock } from "@tabler/icons-react";
import { Field, TextField, Textarea, cn } from "@/lib/components/ui";
import { SubmitButton } from "@/lib/components/SubmitButton";
import { tomorrowISO } from "@/lib/format";
import type { FormState } from "@/lib/actions/capsule";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

type CapsuleAction = (prev: FormState, fd: FormData) => Promise<FormState>;

export function CapsuleForm({
  lang,
  dict,
  action,
  submitLabel,
  initial,
}: {
  lang: Locale;
  dict: Dictionary;
  action: CapsuleAction;
  submitLabel: string;
  initial?: {
    id?: string;
    title: string;
    content: string;
    openDate: string; // yyyy-mm-dd
    isPublic: boolean;
    imageUrl: string | null;
  };
}) {
  const [state, formAction] = useActionState<FormState, FormData>(
    action,
    undefined,
  );
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = (await res.json()) as { url: string };
        setImageUrl(data.url);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-5 px-5 py-6">
      <input type="hidden" name="lang" value={lang} />
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <input type="hidden" name="isPublic" value={isPublic ? "true" : "false"} />

      <Field label={dict.capsule.title}>
        <TextField
          name="title"
          required
          maxLength={100}
          defaultValue={initial?.title}
          placeholder={dict.capsule.titlePlaceholder}
        />
      </Field>

      <Field label={dict.capsule.content}>
        <Textarea
          name="content"
          required
          maxLength={5000}
          defaultValue={initial?.content}
          placeholder={dict.capsule.contentPlaceholder}
        />
      </Field>

      <Field label={dict.capsule.openDate} hint={dict.capsule.openDateHint}>
        <TextField
          name="openDate"
          type="date"
          required
          min={tomorrowISO()}
          defaultValue={initial?.openDate}
        />
      </Field>

      {/* 이미지 업로드 */}
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium text-ink-soft">
          {dict.capsule.image}{" "}
          <span className="text-caption">({dict.common.optional})</span>
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {imageUrl ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card bg-surface">
            <Image src={imageUrl} alt="" fill className="object-cover" sizes="480px" />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/50 text-white"
              aria-label="remove image"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line-strong bg-surface text-caption active:bg-line/40"
          >
            {uploading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <>
                <ImagePlus className="size-6" />
                <span className="text-[13px]">{dict.capsule.image}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 공개 여부 토글 */}
      <button
        type="button"
        onClick={() => setIsPublic((v) => !v)}
        className="flex items-center justify-between rounded-card bg-surface px-4 py-3.5"
      >
        <span className="flex items-center gap-2 text-[15px] font-medium text-ink-strong">
          {isPublic ? (
            <Globe className="size-5 text-brand" />
          ) : (
            <Lock className="size-5 text-caption" />
          )}
          {isPublic ? dict.capsule.public : dict.capsule.private}
        </span>
        <span
          className={cn(
            "relative h-7 w-12 rounded-full transition",
            isPublic ? "bg-brand" : "bg-line-strong",
          )}
        >
          <span
            className={cn(
              "absolute top-1 size-5 rounded-full bg-white shadow transition-all",
              isPublic ? "left-6" : "left-1",
            )}
          />
        </span>
      </button>

      {state?.error ? (
        <p className="text-[13px] text-danger">
          {state.error === "pastDate"
            ? dict.capsule.pastDateError
            : dict.auth.errors.generic}
        </p>
      ) : null}

      <SubmitButton block>{submitLabel}</SubmitButton>
    </form>
  );
}
