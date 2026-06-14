import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 셀프 호스팅(next start)/리버스 프록시 환경에서 호스트 신뢰
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Google({
      // AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET 환경변수를 자동으로 사용
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    // Google 최초 로그인 시 User 테이블에 upsert
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            username: user.name ?? user.email.split("@")[0],
            image: user.image ?? null,
          },
        });
      }
      return true;
    },
    // JWT에 DB의 정식 사용자 id/username 저장
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          token.uid = dbUser.id;
          token.username = dbUser.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.name = (token.username as string) ?? session.user.name;
      }
      return session;
    },
  },
});
