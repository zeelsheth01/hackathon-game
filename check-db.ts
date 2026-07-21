import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './backend/models/User';
import GameSession from './backend/models/GameSession';
import Leaderboard from './backend/models/Leaderboard';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkDatabase() {
  const mongoURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/hackathon_game';
  
  if (mongoURI === '************') {
    console.log("Your DATABASE_URL is still '************'. Please set a valid MongoDB URI in .env.local");
    process.exit(1);
  }

  try {
    console.log(`Connecting to: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully!\n");

    const users = await User.find();
    console.log(`--- Users (${users.length}) ---`);
    console.log(users.slice(0, 3)); // show first 3

    const sessions = await GameSession.find();
    console.log(`\n--- Game Sessions (${sessions.length}) ---`);
    console.log(sessions.slice(0, 3));

    const leaderboard = await Leaderboard.find();
    console.log(`\n--- Leaderboard Entries (${leaderboard.length}) ---`);
    console.log(leaderboard.slice(0, 3));

  } catch (err) {
    console.error("Failed to connect or query:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkDatabase();
