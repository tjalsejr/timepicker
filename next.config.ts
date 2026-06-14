import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 전용 DB 드라이버는 번들에서 제외 (Prisma 7 + pg)
  serverExternalPackages: ["pg"],
  // React <ViewTransition> 활성화 — iOS식 스택 push/pop 애니메이션
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
