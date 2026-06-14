import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

// 데모 시드 — 실행: npm run db:seed
async function main() {
  const password = await bcrypt.hash("demo1234", 10);

  const demo = await prisma.user.upsert({
    where: { email: "demo@timepicker.app" },
    update: {},
    create: {
      email: "demo@timepicker.app",
      username: "타임피커",
      password,
    },
  });

  const friend = await prisma.user.upsert({
    where: { email: "mate@timepicker.app" },
    update: {},
    create: {
      email: "mate@timepicker.app",
      username: "민덕",
      password,
    },
  });

  // 기존 데모 캡슐 정리 후 재생성
  await prisma.capsule.deleteMany({
    where: { userId: { in: [demo.id, friend.id] } },
  });

  await prisma.capsule.createMany({
    data: [
      {
        title: "20살의 나에게",
        content:
          "지금은 개발 공부가 힘들지만 절대 포기하지 마라. 1년 뒤의 너는 분명 더 단단해져 있을 거야.",
        openDate: new Date("2027-01-01"),
        isPublic: true,
        userId: demo.id,
      },
      {
        title: "첫 직장을 시작하며",
        content:
          "긴장되지만 설레는 첫 출근. 미래의 나는 어떤 개발자가 되어 있을까?",
        openDate: new Date("2024-03-01"),
        isPublic: true,
        userId: demo.id,
      },
      {
        title: "올해의 다짐",
        content: "매일 30분씩 운동하기. 책 12권 읽기. 미래의 나야, 지켰니?",
        openDate: new Date("2025-12-31"),
        isPublic: true,
        userId: friend.id,
      },
      {
        title: "혼자만의 비밀",
        content: "이건 나만 볼 수 있는 비공개 캡슐이야.",
        openDate: new Date("2030-06-01"),
        isPublic: false,
        userId: demo.id,
      },
    ],
  });

  console.log("Seed complete:", { demo: demo.email, friend: friend.email });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
