import * as React from "react";
import type { ReactNode } from "react";

// React <ViewTransition>는 Next 번들 React에 존재하지만 기본 @types/react에는
// 노출되지 않아, 런타임 export를 타입 안전하게 감싼다.
type VTClass = string | Record<string, string>;
type ViewTransitionProps = {
  children: ReactNode;
  name?: string;
  enter?: VTClass;
  exit?: VTClass;
  default?: VTClass;
  share?: VTClass;
};

const ViewTransition = (
  React as unknown as {
    ViewTransition: React.ComponentType<ViewTransitionProps>;
  }
).ViewTransition;

// 페이지 콘텐츠를 감싸 iOS식 스택 push/pop 슬라이드를 적용.
// 방향은 <Link transitionTypes={['nav-forward'|'nav-back']}>로 지정한다.
// transitionType이 없으면 default: "none" → 애니메이션 없음(탭 전환 등).
export function StackTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      {/* 단일 래퍼 = 캡처 박스(앱 컬럼 폭, 불투명 배경). 슬라이드 시 화면 단위로 잘림 */}
      <div className="vt-screen">{children}</div>
    </ViewTransition>
  );
}
