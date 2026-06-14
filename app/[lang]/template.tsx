import type { ReactNode } from "react";
import { StackTransition } from "@/lib/components/StackTransition";

// template은 내비게이션마다 새로 마운트된다 → <ViewTransition>의 enter/exit가
// 매 전환마다 발생해 iOS식 슬라이드(이전 화면 exit + 새 화면 enter)가 동작한다.
export default function Template({ children }: { children: ReactNode }) {
  return <StackTransition>{children}</StackTransition>;
}
