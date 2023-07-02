const BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'localhost:3000';

export function getBaseUrl() {
  return BASE_URL;
}
