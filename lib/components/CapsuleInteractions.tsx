"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { IconHeart as Heart, IconHeartFilled as HeartFilled, IconTrash as Trash2, IconSend as Send, IconLogout as LogOut } from "@tabler/icons-react";
import {
  toggleLikeAction,
  addCommentAction,
  deleteCapsuleAction,
  type FormState,
} from "@/lib/actions/capsule";
import { logoutAction } from "@/lib/actions/auth";
import { cn, Button } from "@/lib/components/ui";
import { SubmitButton } from "@/lib/components/SubmitButton";
import { BottomSheet } from "@/lib/components/BottomSheet";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

/* ── 좋아요 버튼 ── */
function LikeInner({ liked, count }: { liked: boolean; count: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-semibold transition",
        liked ? "bg-brand-light text-brand-hover" : "bg-surface text-ink-soft",
      )}
    >
      {liked ? (
        <HeartFilled className="size-5" />
      ) : (
        <Heart className="size-5" />
      )}
      {count}
    </button>
  );
}

export function LikeButton({
  lang,
  capsuleId,
  liked,
  count,
}: {
  lang: Locale;
  capsuleId: string;
  liked: boolean;
  count: number;
}) {
  return (
    <form action={toggleLikeAction}>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="capsuleId" value={capsuleId} />
      <LikeInner liked={liked} count={count} />
    </form>
  );
}

/* ── 댓글 입력 폼 ── */
function CommentSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="submit comment"
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-40"
    >
      <Send className="size-5" />
    </button>
  );
}

export function CommentForm({
  lang,
  capsuleId,
  dict,
}: {
  lang: Locale;
  capsuleId: string;
  dict: Dictionary;
}) {
  const [state, action] = useActionState<FormState, FormData>(
    addCommentAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex items-center gap-2">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="capsuleId" value={capsuleId} />
      <input
        name="content"
        required
        maxLength={500}
        placeholder={dict.capsule.commentPlaceholder}
        className="h-10 flex-1 rounded-full border border-line bg-[rgba(0,23,51,0.02)] px-4 text-[14px] text-ink-strong outline-none placeholder:text-placeholder focus:border-brand"
      />
      <CommentSubmit />
    </form>
  );
}

/* ── 삭제 버튼 (소유자 전용) — 하단 시트 확인 ── */
export function DeleteCapsuleButton({
  lang,
  capsuleId,
  dict,
}: {
  lang: Locale;
  capsuleId: string;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-[14px] font-medium text-danger"
      >
        <Trash2 className="size-4" />
        {dict.common.delete}
      </button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={dict.sheet.deleteTitle}
      >
        <p className="text-[14px] leading-relaxed text-muted">
          {dict.capsule.deleteConfirm}
        </p>
        <form action={deleteCapsuleAction} className="mt-5 flex gap-2">
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name="id" value={capsuleId} />
          <Button type="button" variant="weak" block onClick={() => setOpen(false)}>
            {dict.common.cancel}
          </Button>
          <SubmitButton variant="danger" block>
            {dict.common.delete}
          </SubmitButton>
        </form>
      </BottomSheet>
    </>
  );
}

/* ── 로그아웃 버튼 — 하단 시트 확인 ── */
export function LogoutButton({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-line py-3.5 text-[15px] font-semibold text-ink-soft active:bg-surface"
      >
        <LogOut className="size-4" />
        {dict.auth.logout}
      </button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={dict.sheet.logoutTitle}
      >
        <p className="text-[14px] leading-relaxed text-muted">
          {dict.sheet.logoutDesc}
        </p>
        <form action={logoutAction} className="mt-5 flex gap-2">
          <input type="hidden" name="lang" value={lang} />
          <Button type="button" variant="weak" block onClick={() => setOpen(false)}>
            {dict.common.cancel}
          </Button>
          <SubmitButton variant="danger" block>
            {dict.auth.logout}
          </SubmitButton>
        </form>
      </BottomSheet>
    </>
  );
}
