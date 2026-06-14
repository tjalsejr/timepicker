// 라우트 전환 로딩 — 화면 종류와 무관하게 깔끔한 중앙 스피너
export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <span className="size-8 animate-spin rounded-full border-[3px] border-line border-t-brand" />
    </div>
  );
}
