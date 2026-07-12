import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: { params: { scope: 'read:user user:email repo' } },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        hackerId: { label: "Game ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.hackerId || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findFirst({
          where: { hackerId: credentials.hackerId }
        });

        if (!user || user.hackerId !== credentials.hackerId || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return user;
      }
    })
  ],
  session: { strategy: "jwt" },
  events: {
    async createUser({ user }) {
      if (!(user as any).hackerId) {
        // Generate a random hackerId for new Github users
        const newHackerId = `HACK-${Math.floor(1000 + Math.random() * 9000)}`;
        await prisma.user.update({
          where: { id: user.id },
          data: { hackerId: newHackerId }
        });
      }
    }
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // If logging in via OAuth, we get the account object with access_token
      if (account && account.provider === 'github') {
        token.accessToken = account.access_token;
      }
      
      // When user first signs in (both GitHub and Credentials)
      if (user) {
         // Fallback to fetching hackerId if missing
         if (!(user as any).hackerId) {
            const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
            token.hackerId = dbUser?.hackerId;
         } else {
            token.hackerId = (user as any).hackerId;
         }

         // If they logged in via credentials, we didn't get an 'account' from the provider in this request.
         // We must manually fetch their linked GitHub account to get the access token.
         if (!account || account.provider !== 'github') {
           const githubAccount = await prisma.account.findFirst({
             where: { userId: user.id, provider: 'github' }
           });
           if (githubAccount && githubAccount.access_token) {
             token.accessToken = githubAccount.access_token;
           }
         }
      } else if (!token.hackerId && token.sub) {
        // Fallback for subsequent token refreshes if token somehow missed hackerId
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub }});
        if (dbUser?.hackerId) {
          token.hackerId = dbUser.hackerId;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
        (session.user as any).hackerId = token.hackerId;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
};
