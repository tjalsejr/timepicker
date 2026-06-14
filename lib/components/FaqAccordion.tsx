"use client";

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/components/ui";

export function FaqAccordion({
  title,
  items,
}: {
  title: string;
  items: readonly { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-5 py-12">
      <h2 className="mb-6 text-center text-[22px] font-extrabold text-ink">
        {title}
      </h2>
      <ul className="border-t-2 border-ink">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <li key={it.q} className="border-b border-line">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 py-4 text-left"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-ink" />
                <span className="flex-1 text-[15px] font-bold text-ink">
                  {it.q}
                </span>
                <IconChevronDown
                  className={cn(
                    "size-5 shrink-0 text-caption transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen ? (
                <p className="pb-4 pl-[18px] pr-7 text-[14px] leading-relaxed text-muted">
                  {it.a}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
