import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dns from "dns";
// Connection ready

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      family: 4,
    };

    // Use a mutable uri so we can attempt a fallback if SRV DNS fails
    let uri = MONGODB_URI;

    const attemptConnect = async (connectUri) =>
      mongoose.connect(connectUri, opts).then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      });

    // If SRV is used, temporarily try public DNS resolvers before falling back
    const tryWithPublicDns = async (connectUri) => {
      if (!connectUri.startsWith("mongodb+srv://")) return attemptConnect(connectUri);

      const originalServers = dns.getServers();
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
        console.log("Temporarily using public DNS servers for SRV resolution");
        return await attemptConnect(connectUri);
      } finally {
        try {
          dns.setServers(originalServers);
        } catch (_) {}
      }
    };

    cached.promise = tryWithPublicDns(uri).catch(async (err) => {
      console.error("MongoDB connection error:", err && err.message ? err.message : err);

      // If SRV DNS lookup fails (common in restricted networks), try fallback
      if (
        (err && err.message && err.message.includes("querySrv")) ||
        err.code === "ECONNREFUSED"
      ) {
        try {
          // Read .env.local in project root and look for a non-SRV commented URI
          const envPath = path.resolve(process.cwd(), ".env.local");
          const content = await fs.promises.readFile(envPath, "utf8");
          // Try to find a line containing a non-SRV mongodb:// URI (commented or not)
          const match = content.match(/MONGODB_URI\s*=\s*(mongodb:\/\/[^\r\n]+)/i) ||
            content.match(/#.*MONGODB_URI\s*=\s*(mongodb:\/\/[^\r\n]+)/i);

          if (match && match[1]) {
            const fallback = match[1].trim();
            console.log("Attempting MongoDB fallback URI from .env.local");
            uri = fallback;
            return attemptConnect(uri);
          } else {
            console.warn("No fallback non-SRV MONGODB_URI found in .env.local");
          }
        } catch (readErr) {
          console.error("Failed to read .env.local for fallback URI:", readErr && readErr.message ? readErr.message : readErr);
        }
      }

      // If no fallback or retry fails, rethrow original error
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
