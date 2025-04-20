import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let cachedToken: string | null = null;
let isFetchingToken = false;
let tokenPromise: Promise<string | null> | null = null;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;

  if (!tokenPromise) {
    isFetchingToken = true;
    tokenPromise = fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        cachedToken = session?.user?.accessToken || null;
        return cachedToken;
      })
      .catch((err) => {
        console.error("Failed to fetch session:", err);
        return null;
      })
      .finally(() => {
        isFetchingToken = false;
        tokenPromise = null;
      });
  }

  return tokenPromise;
}

if (typeof window !== "undefined") {
  api.interceptors.request.use(async (config) => {
    const token = await getAccessToken();

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

export default api;
