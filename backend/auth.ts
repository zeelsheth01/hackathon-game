import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";
import User from "./models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Ensure Mongoose is connected for CredentialsProvider
const connectMongoose = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.DATABASE_URL as string);
};

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
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

        await connectMongoose();
        const user = await User.findOne({ hackerId: credentials.hackerId });

        if (!user || user.hackerId !== credentials.hackerId || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          hackerId: user.hackerId,
          name: user.name,
          email: user.email,
        } as any;
      }
    })
  ],
  session: { strategy: "jwt" },
  events: {
    async createUser({ user }) {
      if (!(user as any).hackerId) {
        await connectMongoose();
        const newHackerId = `HACK-${Math.floor(1000 + Math.random() * 9000)}`;
        await User.updateOne(
          { _id: user.id },
          { $set: { hackerId: newHackerId } }
        );
      }
    }
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && account.provider === 'github') {
        token.accessToken = account.access_token;
      }
      
      if (user) {
         if (!(user as any).hackerId) {
            await connectMongoose();
            const dbUser = await User.findById(user.id);
            token.hackerId = dbUser?.hackerId;
         } else {
            token.hackerId = (user as any).hackerId;
         }

         if (!account || account.provider !== 'github') {
           await connectMongoose();
           const githubAccount = await mongoose.connection.db?.collection('accounts').findOne({ userId: new mongoose.Types.ObjectId(user.id), provider: 'github' });
           if (githubAccount && githubAccount.access_token) {
             token.accessToken = githubAccount.access_token;
           }
         }
      } else if (!token.hackerId && token.sub) {
        await connectMongoose();
        const dbUser = await User.findById(token.sub);
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
