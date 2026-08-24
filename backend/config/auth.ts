import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";
import User from "../models/User";
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        await connectMongoose();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.hackerId = (user as any).hackerId;
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
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
};
