"use client";

import { useEffect } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/lib/components/ui";
import { NoticeScreen, useLocaleDict } from "@/lib/components/NoticeScreen";

// 라우트 에러 바운더리 — 경로 로케일에 맞춰 문구 표시
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { dict } = useLocaleDict();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <NoticeScreen
      tone="warning"
      icon={<IconAlertTriangle className="size-7" />}
      title={dict.errors.somethingWrong}
      action={
        <Button onClick={reset} size="md">
          {dict.errors.retry}
        </Button>
      }
    />
  );
}
