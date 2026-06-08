import mongoose from "mongoose";
import crypto from "crypto";

export const castObjectIds = (value: any): any => {
  if (typeof value === "string" && mongoose.isValidObjectId(value)) {
    return new mongoose.Types.ObjectId(value);
  }
  if (Array.isArray(value)) {
    return value.map(castObjectIds);
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      (value as any)[k] = castObjectIds(v);        // recurse
    }
  }
  return value; // everything else (number, null, Date, …
};

export function generateRandomPassword(length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789";
  const randomBytes = crypto.randomBytes(length);
  const password = Array.from(randomBytes).map(
    (byte) => chars[byte % chars.length]
  );
  return password.join("");
}