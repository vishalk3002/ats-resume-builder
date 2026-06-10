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

  // ⚡ FAST MODE (no DB session calls per request)
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 1, // 1 day
  },

  adapter: PrismaAdapter(prisma),

  providers: [
    GitHub,

    Google({
      authorization: {
        params: {
          scope: "openid email profile", // remove heavy params
        },
      },
    }),
  ],

  callbacks: {
    // store user info in JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },

    // runs on every auth() call (server-side)
    async session({ session, token }) {
      if (!session.user?.email) return session;

      // 🧠 critical fix: detect deleted user
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, email: true },
      });

      // if user deleted → invalidate session
      if (!dbUser) {
        return null as any;
      }

      session.user.id = dbUser.id;
      session.user.name = dbUser.name;

      return session;
    },
  },
});
