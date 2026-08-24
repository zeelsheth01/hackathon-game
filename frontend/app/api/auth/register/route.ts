import { NextRequest, NextResponse } from "next/server";
import User from "@/backend/models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Email and a password of at least 6 characters are required" }, { status: 400 });
    }

    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(process.env.DATABASE_URL as string);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newHackerId = `HACK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      hackerId: newHackerId
    });

    await newUser.save();

    return NextResponse.json({ success: true, hackerId: newHackerId });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
