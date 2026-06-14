// 첫 페인트 로딩 — 최종 레이아웃 구조에 맞춘 스켈레톤
export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-20 flex h-14 items-center border-b border-line bg-bg px-4">
        <div className="skeleton h-5 w-24 rounded-md" />
      </div>
      <div className="flex flex-col gap-3 px-5 py-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-card bg-bg p-4 shadow-card">
            <div className="skeleton mb-3 h-5 w-16 rounded-full" />
            <div className="skeleton mb-2 h-5 w-3/4 rounded-md" />
            <div className="skeleton h-4 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
    </>
  );
}
