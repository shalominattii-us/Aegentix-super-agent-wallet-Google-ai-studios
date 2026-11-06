import { sha256Hex } from './sha256.mjs';
import { EXPOSED_SECRET_ENTRIES } from './exposed-secret-denylist.mjs';

const HASHES = new Set(EXPOSED_SECRET_ENTRIES.map((entry) => entry.sha256));

/**
 * @param {string | null | undefined} value
 * @returns {boolean}
 */
export function isExposedSecret(value) {
  if (value == null) return false;
  const trimmed = String(value).trim();
  if (!trimmed) return false;
  return HASHES.has(sha256Hex(trimmed));
}

/**
 * @param {Record<string, string | undefined>} env
 * @returns {string[]} environment variable names whose values match a known-exposed fingerprint
 */
export function findExposedEnvNames(env) {
  const names = [];
  for (const [name, raw] of Object.entries(env || {})) {
    if (isExposedSecret(raw)) names.push(name);
  }
  return names;
}

/**
 * Read a required secret from the environment.
 * Empty, missing, and known-exposed values all return an empty string so callers fail closed.
 * @param {Record<string, string | undefined>} env
 * @param {string} name
 * @returns {string}
 */
export function readSecretEnv(env, name) {
  const value = String((env && env[name]) || '').trim();
  if (!value || isExposedSecret(value)) return '';
  return value;
}

export { EXPOSED_SECRET_ENTRIES };
