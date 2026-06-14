// 사이트 절대 URL — 메타데이터(OG)·sitemap·robots에서 공용으로 사용.
// 배포 시 NEXT_PUBLIC_SITE_URL 환경 변수로 실제 도메인을 지정한다.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
