/**
 * Unified API Configuration
 * Single source of truth for the API base URL across development and production.
 */
export function getApiBaseUrl(): string {
  // 1. If explicit environment variable is set, use it
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== "") {
    return process.env.NEXT_PUBLIC_API_URL.trim();
  }

  // 2. Client-side dynamic origin: match browser hostname to port 8000
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname || "localhost";
    return `${protocol}//${hostname}:8000`;
  }

  // 3. Server-side default
  return "http://localhost:8000";
}

export const API_BASE = getApiBaseUrl();
