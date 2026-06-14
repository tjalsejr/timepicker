"use client";

import { IconCompass } from "@tabler/icons-react";
import { ButtonLink } from "@/lib/components/ui";
import { NoticeScreen, useLocaleDict } from "@/lib/components/NoticeScreen";

// [lang] 레이아웃 안에서 렌더되는 404 — 경로 로케일에 맞춰 문구 표시
export default function NotFound() {
  const { locale, dict } = useLocaleDict();

  return (
    <NoticeScreen
      icon={<IconCompass className="size-7" />}
      title={dict.errors.notFoundTitle}
      description={dict.errors.notFoundDesc}
      action={
        <ButtonLink href={`/${locale}`} size="md">
          {dict.errors.goHome}
        </ButtonLink>
      }
    />
  );
}
