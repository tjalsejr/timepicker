import Image from "next/image";
import { IconUser as User } from "@tabler/icons-react";

// 작성자 인사 카드 — 토스 아티클의 그라데이션 블루 카드 스타일
export function AuthorCard({
  name,
  image,
  hello,
  line,
}: {
  name: string;
  image?: string | null;
  hello: string;
  line: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-gradient-to-br from-[#e8f3ff] to-[#dbe9ff] p-4">
      <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-brand shadow-sm">
        {image ? (
          <Image src={image} alt={name} fill sizes="48px" className="object-cover" />
        ) : (
          <User className="size-6" />
        )}
      </span>
      <div className="flex min-w-0 flex-col">
        <p className="text-[14px] text-ink-soft">{hello}</p>
        <p className="truncate text-[16px] font-bold text-ink">{line}</p>
      </div>
    </div>
  );
}
