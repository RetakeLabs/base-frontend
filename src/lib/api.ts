/**
 * Base HTTP client for talking to a real backend.
 *
 * Auth: this client does not read or store the JWT itself — that stays with
 * whatever owns your session (a cookie, next-auth, a Zustand/Context store,
 * etc). Read it at the call site and pass it in as `token`:
 *
 *   const token = getSessionToken(); // wherever your auth state lives
 *   const me = await api.get<User>("/me", { token });
 *
 * The token is injected as a `Bearer` header inside `request()` below —
 * that's the one place to change if your backend expects a different auth
 * scheme (cookie session, API key, etc).
 */

import { env } from "@/lib/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** JWT for the current session. Injected as `Authorization: Bearer <token>`. */
  token?: string;
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, body, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      // --- Bearer token injection point ---
      // Every authenticated request flows through here, so this is the only
      // place that needs to change to switch auth schemes.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await extractErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
