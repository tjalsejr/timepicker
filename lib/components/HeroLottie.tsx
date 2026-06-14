"use client";

import dynamic from "next/dynamic";
import animationData from "@/lib/assets/hero-lottie.json";

// lottie-web는 document에 의존 → 클라이언트에서만 로드 (SSR 비활성)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function HeroLottie({ className }: { className?: string }) {
  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className={className}
      aria-hidden
    />
  );
}
