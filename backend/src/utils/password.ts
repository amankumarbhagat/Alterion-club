import argon2 from 'argon2';

/**
 * Argon2id configuration — tuned for security without hammering the server.
 * RFC 9106 recommends at least 19 MiB memory; 64 MiB is a reasonable prod value.
 * The `type` field uses the numeric constant argon2id (= 2).
 */
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,   // 64 MiB
  timeCost: 3,         // 3 iterations
  parallelism: 1,
} satisfies Parameters<typeof argon2.hash>[1];

/**
 * Hash a plaintext password using Argon2id.
 * Returns the full encoded string (algorithm + salt + hash) safe to store.
 */
export const hashPassword = async (plaintext: string): Promise<string> => {
  return argon2.hash(plaintext, ARGON2_OPTIONS);
};

/**
 * Verify a plaintext password against an Argon2 encoded hash.
 * Returns true if the password matches; false otherwise.
 */
export const verifyPassword = async (
  hash: string,
  plaintext: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hash, plaintext);
  } catch {
    // argon2.verify throws on malformed hashes; treat as mismatch
    return false;
  }
};

