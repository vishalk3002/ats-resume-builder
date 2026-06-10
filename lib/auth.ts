// import { PrismaAdapter } from "@auth/prisma-adapter";
// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
// import Google from "next-auth/providers/google";
// import prisma from "./prisma";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   pages: {
//     signIn: "/auth/sign-in", //Tells Auth.js to use your custom sign-in page
//   },
//   session: {
//     strategy: "database",
//     maxAge: 60 * 60 * 24 * 1, // 1 days
//   },
//   adapter: PrismaAdapter(prisma),

//   providers: [
//     GitHub,
//     Google({
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//   ],
//   /* callbacks: {
//     jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//       }
//       return token;
//     }

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.name = token.name;
//       }
//       return session;
//     },
//   },*/
// });

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/sign-in",
  },

  session: {
    strategy: "jwt", // ⚡ this is the key change
    maxAge: 60 * 60 * 24 * 7,
  },

  adapter: PrismaAdapter(prisma),

  providers: [
    GitHub,
    Google({
      authorization: {
        params: {
          scope: "openid email profile", // minimal scope = faster
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      const email = session.user?.email;
      if (typeof email !== "string") return null as any;

      const dbUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true },
      });

      if (!dbUser) return null as any; // handles deleted users

      session.user = {
        ...session.user,
        id: dbUser.id,
        name: dbUser.name ?? session.user.name,
        email: dbUser.email ?? email,
      };

      return session;
    },
  },
});
