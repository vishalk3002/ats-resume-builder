import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/sign-in", //Tells Auth.js to use your custom sign-in page
    error: "/auth/error",
  },
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 1, // 7 days
  },
  adapter: PrismaAdapter(prisma),

  providers: [
    GitHub,
    Google({
      authorization: {
        params: {
          prompt: "consent",
          /* access_type: "offline",
          response_type: "code", */
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.image = user.image;
      }
      return session;
    },
  },
  /* callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    } 

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
      }
      return session;
    },
  },*/
});
