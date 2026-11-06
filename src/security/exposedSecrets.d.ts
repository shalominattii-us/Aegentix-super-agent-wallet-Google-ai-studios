export function isExposedSecret(value: string | null | undefined): boolean;
export function findExposedEnvNames(env: Record<string, string | undefined>): string[];
export function readSecretEnv(env: Record<string, string | undefined>, name: string): string;
export const EXPOSED_SECRET_ENTRIES: Array<{
  id: string;
  provider: string;
  env: string[];
  sources: string[];
  sha256: string;
}>;
