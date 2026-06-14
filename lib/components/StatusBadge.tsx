import { IconLock as Lock, IconLockOpen as LockOpen, IconWorld as Globe } from "@tabler/icons-react";
import { Badge } from "./ui";
import type { Dictionary } from "@/lib/i18n";
import type { CapsuleStatus } from "@/lib/format";

// 캡슐 상태 배지 — 잠김 / 개봉 가능 / 공개 (이모지 대신 Tabler 아이콘)
export function StatusBadge({
  status,
  isPublic,
  dict,
}: {
  status: CapsuleStatus;
  isPublic: boolean;
  dict: Dictionary;
}) {
  const s = dict.capsule.status;
  if (status === "locked") {
    return (
      <Badge tone="neutral">
        <Lock className="size-3.5" /> {s.locked}
      </Badge>
    );
  }
  if (isPublic) {
    return (
      <Badge tone="info">
        <Globe className="size-3.5" /> {s.public}
      </Badge>
    );
  }
  return (
    <Badge tone="success">
      <LockOpen className="size-3.5" /> {s.openable}
    </Badge>
  );
}
