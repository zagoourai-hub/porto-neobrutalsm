import crypto from "node:crypto";
import { cookies } from "next/headers";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

// Safe fallback for dev
const SECRET = process.env.SESSION_SECRET || "c37b2d56a7828c46de8189c424a10e74f1d4f2081a4d95bb67104b2a8dcf8c02";

function getSecretKey(): Buffer {
  return Buffer.from(SECRET, "hex");
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  expiresAt: number;
}

export function encryptSession(payload: SessionPayload): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  // Derivate key using PBKDF2
  const key = crypto.pbkdf2Sync(getSecretKey(), salt, 10000, KEY_LENGTH, "sha256");
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final()
  ]);
  
  const tag = cipher.getAuthTag();
  
  // Package as salt:iv:tag:encrypted_hex
  return [
    salt.toString("hex"),
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted.toString("hex")
  ].join(":");
}

export function decryptSession(sessionStr: string): SessionPayload | null {
  try {
    const parts = sessionStr.split(":");
    if (parts.length !== 4) return null;
    
    const [saltHex, ivHex, tagHex, encryptedHex] = parts;
    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    
    const key = crypto.pbkdf2Sync(getSecretKey(), salt, 10000, KEY_LENGTH, "sha256");
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    const payload = JSON.parse(decrypted.toString("utf8")) as SessionPayload;
    
    // Check expiry
    if (Date.now() > payload.expiresAt) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

export async function createSessionCookie(payload: Omit<SessionPayload, "expiresAt">) {
  const duration = 24 * 60 * 60 * 1000; // 24 hours
  const expiresAt = Date.now() + duration;
  const token = encryptSession({ ...payload, expiresAt });
  
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  return decryptSession(sessionCookie);
}

export async function destroySessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
