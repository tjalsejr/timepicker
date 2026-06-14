import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 네이티브/서버 전용 패키지는 번들에서 제외 (Prisma 7 + better-sqlite3)
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
  // React <ViewTransition> 활성화 — iOS식 스택 push/pop 애니메이션
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
