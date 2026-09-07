import { z } from "zod";

/**
 * Validated at import time so a missing/malformed env var fails at boot —
 * in dev the first module that imports this crashes immediately with a
 * readable Zod error; in prod it fails the build/start instead of a
 * `fetch()` breaking deep inside a request handler.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3333/api"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
