import { z } from "zod";
import { localDateISO } from "@/lib/format";

export const registerSchema = z
  .object({
    username: z.string().trim().min(2, "tooShort").max(20),
    email: z.string().trim().email(),
    password: z.string().min(8, "tooShort").max(72),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "mismatch",
    path: ["passwordConfirm"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const capsuleSchema = z.object({
  title: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1).max(5000),
  // yyyy-mm-dd 형식의 실제 달력 날짜만 허용
  openDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "invalid_date"),
  isPublic: z.boolean(),
  // 업로드된 상대 경로(/uploads/..) 또는 외부 http(s) URL 또는 빈 값
  imageUrl: z
    .string()
    .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), {
      message: "invalid_url",
    })
    .optional(),
});

// 작성 시에는 개봉일이 반드시 오늘 이후여야 한다 (서버 검증).
// 수정은 이미 지난 캡슐도 편집할 수 있도록 미래 제약을 두지 않는다.
export const createCapsuleSchema = capsuleSchema.refine(
  (data) => data.openDate > localDateISO(),
  { message: "pastDate", path: ["openDate"] },
);

export const commentSchema = z.object({
  content: z.string().trim().min(1).max(500),
});

export const profileSchema = z.object({
  username: z.string().trim().min(2).max(20),
});
