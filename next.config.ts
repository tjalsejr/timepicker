import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 네이티브/서버 전용 패키지는 번들에서 제외 (Prisma 7 + better-sqlite3)
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
  // React <ViewTransition> 활성화 — iOS식 스택 push/pop 애니메이션
  experimental: {
    viewTransition: true,
  },
  images: {
    // Google 프로필 이미지 등 외부 호스트 허용
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
