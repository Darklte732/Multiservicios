import bcrypt from 'bcryptjs'

/**
 * Server-side password hashing helpers.
 *
 * Switched from client-side SHA-256 + static salt (which leaked the salt via the
 * JS bundle and let anyone with the DB rainbow-table every account) to bcrypt
 * with rounds=12, computed on the server only. Plaintext passwords now leave the
 * client only over TLS in a POST body to `/api/auth/{login,register}`.
 *
 * `verifyPassword` keeps a backward-compat path so users whose row still has the
 * legacy 64-char hex SHA-256 hash can log in once with their existing password;
 * the API route then rehashes to bcrypt and writes it back to `users.password_hash`.
 */

const BCRYPT_ROUNDS = 12

/**
 * Detect a legacy SHA-256 hex hash (64-char lowercase hex) vs a bcrypt hash
 * (which is prefixed with `$2a$` / `$2b$` / `$2y$` and is 60 chars).
 */
export function isLegacyHash(hash: string): boolean {
  return /^[0-9a-f]{64}$/.test(hash)
}

/**
 * Legacy verifier — kept ONLY so users created under the old client-side hashing
 * scheme can authenticate once after this migration ships. On success, the
 * caller MUST rehash the password with `hashPassword` and update the row.
 *
 * This intentionally mirrors the exact algorithm that the old client used:
 * SHA-256 over `password + 'multiservicios_salt_2024'`, hex-encoded.
 */
async function legacyVerify(password: string, hash: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'multiservicios_salt_2024')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const computed = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return computed === hash
}

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS)
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  if (isLegacyHash(hash)) return legacyVerify(plaintext, hash)
  return bcrypt.compare(plaintext, hash)
}
