import mongoose from "mongoose";

// getting uri
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("no mongoDB uri found")
}

// global connection cache
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    // if connection exists, just return it
    if (cached.conn) return cached.conn;

    // if no connection or promise exists, get a promise
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI);
    }

    // await promise since we have a promise now
    cached.conn = await cached.promise;
    return cached.conn;
}