'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Quick check for the secret
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

/**
 * Retrieves the current user from the 'access' cookie.
 * @returns {Promise<Object|null>} The user payload or null if invalid/missing.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.log("No token found");
      return null;
    }

    // Verify and decode the token
    const payload = jwt.verify(token, JWT_SECRET, {
      ignoreExpiration: false,
    });

    return payload;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token expired at:", error.expiredAt);
      try {
        const cookieStore = await cookies();
        cookieStore.delete("access");
      } catch (deleteError) {
      }
      return null;
    }

    // Handle malformed tokens
    if (error.name === "JsonWebTokenError") {
      console.log("Invalid token");
      return null;
    }

    console.error("Unexpected error in getCurrentUser:", error);
    return null;
  }
}