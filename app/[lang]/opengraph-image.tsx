import { ImageResponse } from "next/og";

// 사이트 공용 Open Graph 이미지 — 브랜드 워드마크 중심(라틴 문자만 사용해 폰트 로딩 불필요)
export const alt = "TimePicker — a digital time capsule";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 28px",
            borderRadius: 999,
            background: "#e8f3ff",
            color: "#3182f6",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 8,
          }}
        >
          TIME CAPSULE
        </div>
        <div style={{ fontSize: 132, fontWeight: 800, color: "#191f28" }}>
          TimePicker
        </div>
        <div style={{ fontSize: 40, color: "#6b7684" }}>
          From today&apos;s you, to your future self
        </div>
      </div>
    ),
    { ...size },
  );
}
