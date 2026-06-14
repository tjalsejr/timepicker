"use client";

import { useFormStatus } from "react-dom";
import { IconLoader2 as Loader2 } from "@tabler/icons-react";
import { Button } from "./ui";
import type { ComponentProps } from "react";

// 폼 제출 중 pending 상태 표시 (3-dot 대신 스피너)
export function SubmitButton({
  children,
  ...props
}: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending ? <Loader2 className="size-5 animate-spin" /> : children}
    </Button>
  );
}
