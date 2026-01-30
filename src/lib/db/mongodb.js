import mongoose from "mongoose";
import dns from "dns";
const dnsPromises = dns.promises;

const MONGODB_URI = process.env.MONGODB_URI || null;
const MONGODB_FALLBACK_URI = process.env.MONGODB_FALLBACK_URI || null;

if (!MONGODB_URI && !MONGODB_FALLBACK_URI) {
  throw new Error(
    "Please define MONGODB_URI or MONGODB_FALLBACK_URI environment variable"
  );
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function tryResolveSrvToNonSrv(srvUri) {
  try {
    const m = srvUri.match(/^mongodb\+srv:\/\/(?:([^:]+):([^@]+)@)?([^\/]+)(?:\/(.*))?$/);
    if (!m) return null;
    const [, user, pass, host, rest] = m;
    const srvName = `_mongodb._tcp.${host}`;
    const srvRecords = await dnsPromises.resolveSrv(srvName);
    if (!srvRecords || srvRecords.length === 0) return null;
    const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");

    // Try to obtain TXT record options (may be []).
    let txtOptions = "";
    try {
      const txt = await dnsPromises.resolveTxt(host);
      if (Array.isArray(txt) && txt.length > 0) {
        txtOptions = txt.map((t) => t.join(""))
          .filter(Boolean)
          .join("&");
      }
    } catch (e) {
      // ignore TXT resolution failure
    }

    const auth = user ? `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@` : "";
    const restPart = rest ? `/${rest}` : "";
    const querySep = rest && rest.includes("?") ? "" : (txtOptions ? `?${txtOptions}` : "");

    const nonSrv = `mongodb://${auth}${hosts}${restPart}${querySep}`;
    return nonSrv;
  } catch (e) {
    return null;
  }
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // Conservative connection options for production
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: process.env.MONGODB_MAX_POOL_SIZE ? Number(process.env.MONGODB_MAX_POOL_SIZE) : 10,
      minPoolSize: process.env.MONGODB_MIN_POOL_SIZE ? Number(process.env.MONGODB_MIN_POOL_SIZE) : 0,
      // Removed `useNewUrlParser` and `useUnifiedTopology` as they're ignored/unsupported in newer mongoose versions
      family: 4,
    };

    cached.promise = (async () => {
      // Try primary URI first if present
      if (MONGODB_URI) {
        const maxAttempts = 3;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            const conn = await mongoose.connect(MONGODB_URI, opts);
            console.log(`✅ MongoDB connected using MONGODB_URI (attempt ${attempt})`);
            return conn;
          } catch (err) {
            console.error(`❌ Primary MongoDB connection failed (attempt ${attempt}):`, err.message);
            if (attempt < maxAttempts) {
              const backoff = 500 * attempt;
              console.log(`⏳ Retrying primary connection in ${backoff}ms...`);
              await sleep(backoff);
              continue;
            }

            // If URI is SRV, try resolving SRV to non-SRV and connect
            if (MONGODB_URI.startsWith("mongodb+srv://")) {
              console.log("ℹ️ Attempting to resolve SRV records and form non-SRV URI...");
              const nonSrv = await tryResolveSrvToNonSrv(MONGODB_URI);
              if (nonSrv) {
                try {
                  const conn2 = await mongoose.connect(nonSrv, opts);
                  console.log("✅ MongoDB connected using resolved non-SRV URI");
                  return conn2;
                } catch (err2) {
                  console.error("❌ Connecting with resolved non-SRV URI failed:", err2.message);
                }
              } else {
                console.log("ℹ️ SRV resolution to non-SRV URI failed or returned no hosts");
              }
            }

            // fall through to fallback if configured
            if (!MONGODB_FALLBACK_URI) {
              throw err;
            }
            console.log("ℹ️ Attempting MONGODB_FALLBACK_URI due to primary failure...");
          }
        }
      }

      // Try fallback URI if present
      if (MONGODB_FALLBACK_URI) {
        try {
          const conn2 = await mongoose.connect(MONGODB_FALLBACK_URI, opts);
          console.log("✅ MongoDB connected using MONGODB_FALLBACK_URI");
          return conn2;
        } catch (err2) {
          console.error("❌ Fallback MongoDB connection failed:", err2.message);
          throw err2;
        }
      }

      throw new Error("No MongoDB URI available to connect");
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e.message);
    throw new Error(`Failed to connect to MongoDB: ${e.message}`);
  }

  return cached.conn;
}
