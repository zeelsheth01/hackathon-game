import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/backend/auth";
import User from "@/backend/models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
    }

    const body = await req.json();
    const { password } = body;

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    await mongoose.connect(process.env.DATABASE_URL as string);
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set password error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

