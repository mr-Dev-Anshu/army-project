import mongoose from "mongoose";
// Production-safe MongoDB connector
// - Uses only env vars: MONGODB_URI and optional MONGODB_FALLBACK_URI
// - Does not mutate system DNS or read project files at runtime
// - Uses conservative connection options and sanitized logging

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_FALLBACK_URI = process.env.MONGODB_FALLBACK_URI || null;
const NODE_ENV = process.env.NODE_ENV || "development";

if (!MONGODB_URI) {
  throw new Error("Please set MONGODB_URI environment variable");
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // Conservative connection options for production
    const opts = {
      bufferCommands: false,
      family: 4,
      serverSelectionTimeoutMS: 10000, // fail faster if server unreachable
      socketTimeoutMS: 45000,
      maxPoolSize: 50,
      minPoolSize: 0,
      // Do not auto-create indexes in production
      autoIndex: false,
    };

    const connectOnce = async (uri) =>
      mongoose.connect(uri, opts).then((m) => {
        console.log("MongoDB connected");
        return m;
      });

    cached.promise = connectOnce(MONGODB_URI).catch(async (err) => {
      // Sanitize message
      const msg = err && err.message ? err.message : String(err);
      console.error("MongoDB primary connect failed:", msg);

      // If fallback provided, try it (explicit env var only)
      if (MONGODB_FALLBACK_URI) {
        try {
          console.log("Attempting MongoDB fallback URI");
          return await connectOnce(MONGODB_FALLBACK_URI);
        } catch (fbErr) {
          const fbMsg = fbErr && fbErr.message ? fbErr.message : String(fbErr);
          console.error("MongoDB fallback connect failed:", fbMsg);
        }
      }

      // In production, throw to fail fast so ops can fix config
      if (NODE_ENV === "production") {
        console.error("MongoDB connection failed in production — exiting");
        throw err;
      }

      // For non-production, rethrow to let caller handle retry or debugging
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
