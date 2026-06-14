import Link from "next/link";
import "./globals.css";

// 루트 404 — 로케일 세그먼트 밖의 미매칭 경로용 (자체 html/body)
export default function RootNotFound() {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell items-center justify-center text-center">
          <div className="flex flex-col items-center gap-4 px-6">
            <p className="text-[18px] font-bold text-ink">
              페이지를 찾을 수 없어요
            </p>
            <p className="text-[13px] text-muted">Page not found</p>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-5 text-[15px] font-semibold text-white"
            >
              홈으로 · Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
