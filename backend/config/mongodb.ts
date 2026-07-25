import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const uri = process.env.DATABASE_URL || "";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // Prevent crash during Next.js build when env vars might not be loaded yet
  clientPromise = Promise.resolve({ db: () => ({}) } as any);
} else if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    if (!uri) {
      throw new Error('Invalid/Missing environment variable: "DATABASE_URL"');
    }
    
    await mongoose.connect(uri);
    isConnected = true;
    console.log('Mongoose connected successfully');
  } catch (error) {
    console.error('Mongoose connection error:', error);
    throw error;
  }
};
