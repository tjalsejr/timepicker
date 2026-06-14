import type { MetadataRoute } from "next";

// PWA 매니페스트 — 홈 화면 추가 시 모바일 앱처럼 standalone 실행
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TimePicker — 타임피커",
    short_name: "TimePicker",
    description: "현재의 내가 미래의 나에게 보내는 디지털 타임캡슐",
    start_url: "/ko",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3182f6",
    lang: "ko",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
