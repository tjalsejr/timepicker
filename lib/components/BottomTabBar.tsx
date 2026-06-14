"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome as Home,
  IconCompass as Compass,
  IconCirclePlus as PlusCircle,
  IconMailbox as Mailbox,
  IconUser as User,
  IconWriting as PenLine,
  IconChevronRight as ChevronRight,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";
import { cn } from "./ui";
import { BottomSheet } from "./BottomSheet";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export function BottomTabBar({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // 탭 루트에서만 하단바 표시. push된 화면(로그인/상세/작성 등)에서는 숨김.
  const rootPaths = [
    `/${lang}`,
    `/${lang}/explore`,
    `/${lang}/my`,
    `/${lang}/mypage`,
  ];
  const onRoot = rootPaths.includes(pathname);
  if (!onRoot) return null;

  const navItems: Array<{
    key: keyof Dictionary["nav"];
    href: string;
    icon: TablerIcon;
  }> = [
    { key: "home", href: `/${lang}`, icon: Home },
    { key: "explore", href: `/${lang}/explore`, icon: Compass },
    { key: "my", href: `/${lang}/my`, icon: Mailbox },
    { key: "profile", href: `/${lang}/mypage`, icon: User },
  ];

  // 탭바는 루트에서만 보이므로 정확히 일치할 때만 활성 (/mypage 가 /my 에 걸리는 문제 방지)
  const isActive = (href: string) => pathname === href;

  // 탭 순서 기준 방향 — 오른쪽 탭이면 forward(오른쪽→), 왼쪽 탭이면 back(←왼쪽)
  const order = navItems.map((i) => i.href);
  const currentIndex = order.indexOf(pathname);
  const dirFor = (href: string): "nav-forward" | "nav-back" =>
    order.indexOf(href) > currentIndex ? "nav-forward" : "nav-back";

  // home, explore | [작성] | my, profile
  const left = navItems.slice(0, 2);
  const right = navItems.slice(2);

  return (
    <>
      <nav
        style={{ viewTransitionName: "app-tabbar" }}
        className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-line bg-bg pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="flex h-16 items-stretch">
          {left.map((item) => (
            <TabLink
              key={item.key}
              href={item.href}
              icon={item.icon}
              label={dict.nav[item.key]}
              active={isActive(item.href)}
              direction={dirFor(item.href)}
            />
          ))}

          {/* 작성 — 클릭 시 바텀시트 */}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-full w-full flex-col items-center justify-center gap-1"
              aria-label={dict.nav.create}
            >
              <PlusCircle className="size-6 text-placeholder" stroke={2} />
              <span className="text-[11px] text-caption">{dict.nav.create}</span>
            </button>
          </li>

          {right.map((item) => (
            <TabLink
              key={item.key}
              href={item.href}
              icon={item.icon}
              label={dict.nav[item.key]}
              active={isActive(item.href)}
              direction={dirFor(item.href)}
            />
          ))}
        </ul>
      </nav>

      <BottomSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={dict.sheet.menuTitle}
      >
        <div className="flex flex-col gap-2 pb-1">
          <SheetAction
            href={`/${lang}/capsules/new`}
            icon={PenLine}
            title={dict.sheet.newCapsule}
            desc={dict.sheet.newCapsuleDesc}
            onClick={() => setMenuOpen(false)}
            primary
          />
          <SheetAction
            href={`/${lang}/explore`}
            icon={Compass}
            title={dict.sheet.explore}
            desc={dict.sheet.exploreDesc}
            onClick={() => setMenuOpen(false)}
          />
        </div>
      </BottomSheet>
    </>
  );
}

function TabLink({
  href,
  icon: Icon,
  label,
  active,
  direction,
}: {
  href: string;
  icon: TablerIcon;
  label: string;
  active: boolean;
  direction: "nav-forward" | "nav-back";
}) {
  return (
    <li className="flex-1">
      <Link
        href={href}
        transitionTypes={[direction]}
        className="flex h-full flex-col items-center justify-center gap-1"
      >
        <Icon
          className={cn("size-6", active ? "text-brand" : "text-placeholder")}
          stroke={active ? 2.4 : 2}
        />
        <span
          className={cn(
            "text-[11px]",
            active ? "font-semibold text-brand" : "text-caption",
          )}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}

function SheetAction({
  href,
  icon: Icon,
  title,
  desc,
  onClick,
  primary,
}: {
  href: string;
  icon: TablerIcon;
  title: string;
  desc: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      transitionTypes={["nav-forward"]}
      className="flex items-center gap-3 rounded-card bg-surface px-4 py-3.5 active:brightness-95"
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          primary ? "bg-brand text-white" : "bg-bg text-brand",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-[15px] font-semibold text-ink">{title}</span>
        <span className="text-[13px] text-muted">{desc}</span>
      </span>
      <ChevronRight className="size-5 text-placeholder" />
    </Link>
  );
}
