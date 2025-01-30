// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

if (typeof window !== "undefined") {
  api.interceptors.request.use(async (config) => {
    const session = await fetch("/api/auth/session").then((res) => res.json());
    const token = session?.user?.accessToken;

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

export default api;
