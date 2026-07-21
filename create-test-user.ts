import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import User from './backend/models/User';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function createTestUser() {
  const mongoURI = process.env.DATABASE_URL as string;
  await mongoose.connect(mongoURI);
  
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const newUser = await User.create({
    name: "Test Hacker",
    email: "test@hackathon.com",
    hackerId: "HACK-9999",
    password: hashedPassword,
    githubId: "12345678",
    githubToken: "mock_token"
  });
  
  console.log("Created Test User:", newUser.hackerId);
  await mongoose.disconnect();
}

createTestUser();
